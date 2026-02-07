import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProfileEditForm from './ProfileEditForm';
import ResearchInterestsEditor from './ResearchInterestsEditor';
import PublicationsEditor from './PublicationsEditor';
import ContactInfoEditForm from './ContactInfoEditForm';

interface AdminEditPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AdminEditPanel({ open, onOpenChange }: AdminEditPanelProps) {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Edit Portfolio</SheetTitle>
          <SheetDescription>
            Update your research portfolio information
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="interests">Interests</TabsTrigger>
              <TabsTrigger value="publications">Publications</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="mt-6">
              <ProfileEditForm />
            </TabsContent>
            <TabsContent value="interests" className="mt-6">
              <ResearchInterestsEditor />
            </TabsContent>
            <TabsContent value="publications" className="mt-6">
              <PublicationsEditor />
            </TabsContent>
            <TabsContent value="contact" className="mt-6">
              <ContactInfoEditForm />
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
