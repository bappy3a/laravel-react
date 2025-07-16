import PostCreateModel from '@/components/post-create';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts',
        href: '/posts',
    },
];

interface Post {
    id: number;
    image: string | null;
    title: string;
    content: string;
}
interface PostProps {
    posts: Post[];
}

export default function Dashboard() {
    const [modalOpen, setModalOpen] = useState(false);
    const { processing, delete: destroy } = useForm();
    const { posts } = usePage().props;

    const hendelDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this post?')) {
            destroy(route('posts.destroy', id), {
                onSuccess: () => {
                    toast.success('Post deleted successfully', {
                        description: 'This post has been removed from the list.',
                    });
                },
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />
            <div className="header flex items-center justify-between p-6">
                <div className="w-1/2">
                    <h1 className="text-2xl font-bold">Posts</h1>
                    <p className="mt-1">This is the posts page.</p>
                </div>
                <div className="w-1/2 text-right">
                    <Button onClick={() => setModalOpen(true)}>Create a new post</Button>
                </div>
            </div>
            <div className="justify-center p-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Id</TableHead>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Content</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts.map((post) => (
                            <TableRow key={post.id}>
                                <TableCell className="w-[100px]">{post.id}</TableCell>
                                <TableCell>
                                    {post.image ? (
                                        <img src={post.image} alt={post.title} className="h-10 w-10 rounded object-cover" />
                                    ) : (
                                        <span>No Image</span>
                                    )}
                                </TableCell>
                                <TableCell>{post.title}</TableCell>
                                <TableCell>{post.content}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        disabled={processing}
                                        onClick={() => hendelDelete(post.id)}
                                        className="cursor-pointer bg-red-500 hover:bg-red-700"
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <PostCreateModel open={modalOpen} setOpen={setModalOpen} />
        </AppLayout>
    );
}
