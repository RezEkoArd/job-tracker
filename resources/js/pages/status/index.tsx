import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";   
import { useEffect } from 'react';
import { toast } from 'sonner';
// Time Format
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id'; 


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Status {
    id: number;
    name: string;
    created_at: string;
}

interface FlashData extends Record<string, any> {
    flash: {
        message?: string;
        errorMsg?: string;
    },
    status?: Status[];
}

export default function Status() {
    const {statuses, flash} = usePage<FlashData>().props;
    const {processing, delete: destroy} = useForm();

    dayjs.extend(relativeTime);
    dayjs.locale('id'); 

    useEffect(() => {
        if (flash.message) {
            toast.success(flash.message, {
                duration: 3000,
            });
        } 

        if (flash.errorMsg) {
            toast.error(flash.errorMsg, {
                duration: 3000,
            });
        }
    },[flash]) ;

    const handleDelete = (id:number, name: string) => {
        if (confirm(`Do you want to delete - ${id}. ${name}`)) {
            destroy(route('status.destroy', id));
        }
    }

    

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <Link href="/status/create">
                    <Button>Create a New Status</Button>
                </Link>
                <div className='w-1/2 '>

                {statuses && statuses.length > 0 ? (
                    <Table className='rounded-xl bg-slate-100 dark:bg-transparent'>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Created_at</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {statuses.map((status:Status , index: number) => (
                        <TableRow key={status.id}>
                            <TableCell className="font-medium">{index+1}</TableCell>
                            <TableCell>{status.name}</TableCell>
                            <TableCell>{dayjs(status.created_at).fromNow()}</TableCell>
                            <TableCell className="text-right">
                                <Button disabled={processing} onClick={() => handleDelete(status.id, status.name)}  className='bg-red-400 hover:bg-red-700'>Delete</Button>
                            </TableCell>
                        </TableRow>
                        ))}
                        
                    </TableBody>
                    </Table>
                ) : "No statuses available."}
                </div>
            </div>
        </AppLayout>
    );
}
