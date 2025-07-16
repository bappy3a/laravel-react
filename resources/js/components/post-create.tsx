import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function PostCreateModel({ open, setOpen }: Props) {
    const [preview, setPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm<{
        title: string;
        content: string;
        image: File | null;
    }>({
        title: '',
        content: '',
        image: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('posts.store'), {
            forceFormData: true,
            onSuccess: () => {
                setOpen(false);
                reset();
                setPreview(null);
                toast.success('Event has been created.');
            },
            onError: (err) => {
                console.error(err);
            },
        });
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(v) => {
                if (!v) {
                    reset();
                    setPreview(null);
                }
                setOpen(v);
            }}
        >
            <form onSubmit={handleSubmit} className="w-full">
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Create Post</DialogTitle>
                        <DialogDescription>Fill in the post details below.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea id="content" value={data.content} onChange={(e) => setData('content', e.target.value)} />
                            {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="image">Image</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null;
                                    setData('image', file);
                                    if (file) {
                                        setPreview(URL.createObjectURL(file));
                                    } else {
                                        setPreview(null);
                                    }
                                }}
                            />
                            {preview && <img src={preview} alt="Preview" className="mt-2 h-30 w-32 rounded border object-cover" />}
                            {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button onClick={handleSubmit} type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Post'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}
