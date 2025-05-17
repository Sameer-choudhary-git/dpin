
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';

interface AddWebsiteDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (url: string) => void;
}

const AddWebsiteDialog = ({ open, onClose, onAdd }: AddWebsiteDialogProps) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      websiteUrl: ''
    }
  });

  const onSubmit = (data: { websiteUrl: string }) => {
    if (!data.websiteUrl) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }
    
    onAdd(data.websiteUrl);
    reset();
    onClose();
    toast({
      title: "Website added",
      description: `${data.websiteUrl} has been added to monitoring.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Website to Monitor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="websiteUrl">Website URL</Label>
              <Input 
                id="websiteUrl" 
                placeholder="https://example.com" 
                {...register("websiteUrl", { required: true })}
              />
              {errors.websiteUrl && (
                <p className="text-sm text-alert-critical">Please enter a valid URL</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} type="button">Cancel</Button>
            <Button type="submit" className="bg-guardian-600 hover:bg-guardian-700">Add Website</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWebsiteDialog;
