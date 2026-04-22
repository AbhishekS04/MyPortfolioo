"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandMenu,
  CommandMenuContent,
  CommandMenuInput,
  CommandMenuList,
  CommandMenuGroup,
  CommandMenuItem,
  CommandMenuSeparator,
  useCommandMenuShortcut,
} from "@/components/ui/command-menu";
import {
  Home,
  User,
  Briefcase,
  Github,
  Twitter,
  Linkedin,
  Mail,
  FileText,
  Copy,
  ArrowRight,
} from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  useCommandMenuShortcut(() => setOpen(true));

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <CommandMenu open={open} onOpenChange={setOpen}>
      {/* Trigger is handled globally by shortcut, so no visual trigger needed here */}

      <CommandMenuContent>
        <CommandMenuInput placeholder="Type a command or search..." />
        <CommandMenuList>
          <CommandMenuGroup heading="Explore the Verse">
            <CommandMenuItem
              icon={<Home className="text-blue-400" />}
              index={0}
              keywords={["home", "hq", "index", "return"]}
              onSelect={() => runCommand(() => router.push("/"))}
            >
              <span className="font-medium text-white/90">Return to HQ</span>
              <span className="ml-2 text-xs text-white/40 hidden sm:inline-block">
                Home Page
              </span>
            </CommandMenuItem>
            <CommandMenuItem
              icon={<User className="text-purple-400" />}
              index={1}
              keywords={["about", "bio", "lore", "who", "story"]}
              onSelect={() => runCommand(() => router.push("/about"))}
            >
              <span className="font-medium text-white/90">
                Who is Abhishek?
              </span>
              <span className="ml-2 text-xs text-white/40 hidden sm:inline-block">
                The lore behind the dev
              </span>
            </CommandMenuItem>
            <CommandMenuItem
              icon={<Briefcase className="text-yellow-400" />}
              index={2}
              keywords={[
                "works",
                "projects",
                "portfolio",
                "archives",
                "case studies",
              ]}
              onSelect={() => runCommand(() => router.push("/works"))}
            >
              <span className="font-medium text-white/90">
                Inspect the Archives
              </span>
              <span className="ml-2 text-xs text-white/40 hidden sm:inline-block">
                My finest works
              </span>
            </CommandMenuItem>
            <CommandMenuItem
              icon={<Github className="text-green-400" />}
              index={3}
              keywords={["github", "code", "source", "repo", "git"]}
              onSelect={() =>
                runCommand(() => router.push("/github/AbhishekS04"))
              }
            >
              <span className="font-medium text-white/90">
                Analyze Source Code
              </span>
              <span className="ml-2 text-xs text-white/40 hidden sm:inline-block">
                View GitHub without leaving
              </span>
            </CommandMenuItem>
          </CommandMenuGroup>

          <CommandMenuSeparator />

          <CommandMenuGroup heading="Connect">
            <CommandMenuItem
              icon={<Github />}
              index={4}
              keywords={["github", "profile", "social"]}
              onSelect={() =>
                runCommand(() =>
                  window.open("https://github.com/AbhishekS04", "_blank"),
                )
              }
            >
              GitHub Profile
            </CommandMenuItem>
            <CommandMenuItem
              icon={<Twitter />}
              index={5}
              keywords={["twitter", "x", "social", "tweet"]}
              onSelect={() =>
                runCommand(() =>
                  window.open("https://x.com/_abhishek2304", "_blank"),
                )
              }
            >
              Twitter / X
            </CommandMenuItem>
            <CommandMenuItem
              icon={<Linkedin />}
              index={6}
              keywords={["linkedin", "network", "social", "career"]}
              onSelect={() =>
                runCommand(() =>
                  window.open(
                    "https://www.linkedin.com/in/abhishek-singh200423",
                    "_blank",
                  ),
                )
              }
            >
              LinkedIn Network
            </CommandMenuItem>
          </CommandMenuGroup>

          <CommandMenuSeparator />

          <CommandMenuGroup heading="Protocol">
            <CommandMenuItem
              icon={<Copy />}
              index={7}
              shortcut="cmd+c"
              keywords={["copy", "email", "address", "contact"]}
              onSelect={() =>
                runCommand(() => {
                  navigator.clipboard.writeText("your.email@example.com");
                })
              }
            >
              Copy Coordinates (Email)
            </CommandMenuItem>
            <CommandMenuItem
              icon={<FileText />}
              index={8}
              shortcut="cmd+r"
              keywords={["resume", "cv", "pdf", "dossier", "download"]}
              onSelect={() =>
                runCommand(() => window.open("/resume.pdf", "_blank"))
              }
            >
              Download Dossier (Resume)
            </CommandMenuItem>
            <CommandMenuItem
              icon={<Mail />}
              index={9}
              keywords={["send", "mail", "contact", "message", "write"]}
              onSelect={() =>
                runCommand(
                  () =>
                    (window.location.href = "mailto:your.email@example.com"),
                )
              }
            >
              Establish Comms (Mailto)
            </CommandMenuItem>
          </CommandMenuGroup>
        </CommandMenuList>
      </CommandMenuContent>
    </CommandMenu>
  );
}
