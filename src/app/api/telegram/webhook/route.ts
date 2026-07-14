import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      console.error('Missing Telegram Bot config');
      return NextResponse.json({ error: 'Missing config' }, { status: 500 });
    }

    const body = await req.json();

    // Handle callback queries (like clicking the Delete button)
    if (body.callback_query) {
      const cq = body.callback_query;
      if (cq.from.id.toString() !== CHAT_ID)
        return NextResponse.json({ status: 'unauthorized' });

      const data = cq.data;
      if (data && data.startsWith('delete_story:')) {
        const storyId = data.split(':')[1];

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey =
          process.env.SUPABASE_SERVICE_ROLE_KEY ||
          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

        if (supabaseUrl && supabaseKey) {
          const supabase = createClient(supabaseUrl, supabaseKey);
          await supabase.from('social_stories').delete().eq('id', storyId);

          // Answer callback to stop loading state on button
          await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                callback_query_id: cq.id,
                text: 'Story deleted!',
              }),
            },
          );

          // Edit the original message text to show it was deleted
          await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: CHAT_ID,
                message_id: cq.message.message_id,
                text: '🗑️ This story has been deleted from your portfolio.',
              }),
            },
          );
        }
      }
      return NextResponse.json({ status: 'ok' });
    }

    // Only process messages
    if (!body.message) {
      return NextResponse.json({ status: 'ignored' });
    }

    const message = body.message;

    // Security check: Only process messages from your specific CHAT_ID
    if (message.chat.id.toString() !== CHAT_ID) {
      return NextResponse.json({ status: 'unauthorized' });
    }

    // Handle Text Commands
    if (message.text) {
      if (message.text === '/start' || message.text === '/help') {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: 'Welcome to your Portfolio Stories Bot! 🚀\n\n📷 Send a Photo or 🎥 Video to instantly upload it as a story.\n🗑️ Send /list to manage and delete your recent stories.',
          }),
        });
        return NextResponse.json({ status: 'ok' });
      }

      if (message.text === '/list') {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey =
          process.env.SUPABASE_SERVICE_ROLE_KEY ||
          process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

        if (supabaseUrl && supabaseKey) {
          const supabase = createClient(supabaseUrl, supabaseKey);
          const { data: stories } = await supabase
            .from('social_stories')
            .select('id, caption, display_order')
            .order('created_at', { ascending: false })
            .limit(5);

          if (!stories || stories.length === 0) {
            await fetch(
              `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chat_id: CHAT_ID,
                  text: "You don't have any stories uploaded yet.",
                }),
              },
            );
            return NextResponse.json({ status: 'ok' });
          }

          const inline_keyboard = stories.map((story) => {
            let title = story.caption
              ? story.caption
              : `Story #${story.display_order || '?'}`;
            if (title.length > 20) title = title.substring(0, 20) + '...';
            return [
              {
                text: `🗑️ Delete: ${title}`,
                callback_data: `delete_story:${story.id}`,
              },
            ];
          });

          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: CHAT_ID,
              text: 'Here are your 5 most recent stories. Tap a button below to delete it:',
              reply_markup: { inline_keyboard },
            }),
          });
        }
        return NextResponse.json({ status: 'ok' });
      }
    }

    let fileId = null;
    let type = null;
    // Check if message has a photo
    if (message.photo && message.photo.length > 0) {
      // Telegram sends multiple resolutions, get the largest one (last in array)
      fileId = message.photo[message.photo.length - 1].file_id;
      type = 'photo';
    }
    // Check if message has a video
    else if (message.video) {
      fileId = message.video.file_id;
      type = 'video';
    }

    if (fileId && type) {
      const caption = message.caption || '';

      // Initialize Supabase admin client to insert the row
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey =
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Get current max display_order
        const { data: currentStories } = await supabase
          .from('social_stories')
          .select('display_order')
          .order('display_order', { ascending: false })
          .limit(1);

        const nextOrder =
          currentStories && currentStories.length > 0
            ? (currentStories[0].display_order || 0) + 1
            : 1;

        // Create our custom media URL that points to our Next.js proxy
        const mediaUrl = `/api/telegram/media?file_id=${fileId}&type=${type}`;

        // Insert the story into Supabase and get the inserted ID back
        const { data: insertedStory, error } = await supabase
          .from('social_stories')
          .insert({
            platform: 'telegram',
            media_url: mediaUrl,
            caption: caption,
            link_url: '', // Can be extended to extract URLs from caption
            display_order: nextOrder,
          })
          .select()
          .single();

        if (error) {
          console.error('Supabase insert error:', error);

          // Reply to user about error
          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: CHAT_ID,
              text: `❌ Error saving story: ${error.message}`,
            }),
          });
        } else if (insertedStory) {
          // Success! Send a confirmation with a delete button
          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: CHAT_ID,
              text: `✅ ${type === 'video' ? 'Video' : 'Photo'} story saved successfully!`,
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: '🗑️ Delete this story',
                      callback_data: `delete_story:${insertedStory.id}`,
                    },
                  ],
                ],
              },
            }),
          });
        }
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
