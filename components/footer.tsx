import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-sm text-muted-foreground">
          MCTool &copy; {new Date().getFullYear()}. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link href="https://github.com/art3m4ik3/MCTool" className="text-sm text-muted-foreground hover:underline">
            Github
          </Link>
        </div>
      </div>
    </footer>
  )
}
