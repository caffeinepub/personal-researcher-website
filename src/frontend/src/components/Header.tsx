import { useState } from 'react';
import { Moon, Sun, Edit } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import LoginButton from './LoginButton';
import AdminEditPanel from './admin/AdminEditPanel';
import { useOwnerStatus } from '@/hooks/useOwnerStatus';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { isOwner, isAuthenticated, isLoading } = useOwnerStatus();
  const [editPanelOpen, setEditPanelOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">Research Portfolio</h1>
          </div>
          <nav className="flex items-center gap-6">
            <a
              href="#about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </a>
            <a
              href="#research"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Research
            </a>
            <a
              href="#publications"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Publications
            </a>
            <a
              href="#contact"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Contact
            </a>
            {isAuthenticated && isOwner && (
              <Button
                variant="default"
                size="sm"
                onClick={() => setEditPanelOpen(true)}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            )}
            <LoginButton />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-9 w-9"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </nav>
        </div>
        {isAuthenticated && !isLoading && !isOwner && (
          <div className="border-t border-border/40 bg-muted/50">
            <div className="container py-2">
              <Alert className="border-0 bg-transparent p-0">
                <AlertDescription className="text-sm text-muted-foreground">
                  You are logged in but do not have permission to edit this portfolio.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        )}
      </header>
      <AdminEditPanel open={editPanelOpen} onOpenChange={setEditPanelOpen} />
    </>
  );
}
