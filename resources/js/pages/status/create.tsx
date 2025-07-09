import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create a New Status',
        href: '/status/create',
    },
];

export default function CreateStatus() {
    const {data, setData, processing, errors, post} = useForm({
        name: '',
    })

    const handleSubmit = (e:React.FormEvent) => {
        e.preventDefault();
        post(route('status.store'))
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create New Status" />
            <form onSubmit={handleSubmit}>
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                    <Label htmlFor='name'>Name</Label>
                    <Input placeholder='Name Status' className='w-1/3' name='name' value={data.name} onChange={(e) => setData('name', e.target.value)} required/>
                    <Button type='submit' disabled={processing} className='w-1/6 mt-4'>
                    Create New Status
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
