import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';
import { Check, ChevronsUpDown, Link2, Pencil, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Jobs', href: '/pekerjaan' },
];

interface Status {
  id: number;
  name: string;
}

interface JobFormData {
  id: number;
  position: string;
  company: string;
  location: string;
  job_url: string;
  salary: string;
  job_type: string;
  status: Status;
  applied_at: Date | undefined;
}

interface Paginator<T>{
  current_page: number;
  data: T[];
  first_page_url: string| null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  links: Array<{
      url: string | null;
      label: string;
      active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

interface PageProps extends Record<string, any> {
  flash: {
    message?: string;
    errorMsg?: string;
  };
  statuses: Status[];
  jobs: Paginator<JobFormData>;
}

export default function PekerjaanDashboard() {
  const { jobs,statuses, flash } = usePage<PageProps>().props;
  const { delete: destroy} = useForm();


  dayjs.extend(relativeTime);
  dayjs.locale('id');

  useEffect(() => {
    if (flash.message) {
      toast.success(flash.message, { duration: 3000 });
    }

    if (flash.errorMsg) {
      toast.error(flash.errorMsg, { duration: 3000 });
    }
  }, [flash]);

  const getStatusVariant = (
    id?: number
  ): 'applied' | 'interview' | 'offer' | 'rejected' | 'secondary' => {
    switch (id) {
      case 1:
        return 'applied';
      case 2:
        return 'interview';
      case 3:
        return 'offer';
      case 4:
        return 'rejected';
      default:
        return 'secondary';
    }
  };
  
  const handleDelete = (id: number) => {
    console.log('delete ')
    destroy(route('pekerjaan.destroy',id))
  }

  // Pagination
  const paginationLinks = jobs?.links.filter(link => {
    return !isNaN(Number(link.label)) || link.label === '...';
});

 
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Job Tracker List" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <Link href="/pekerjaan/create">
          <Button variant="secondary" className="cursor-pointer">
            Create Job Tracker
          </Button>
        </Link>
        <Table>
          <TableCaption>A list of your recent job applications.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Job URL</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Job Type</TableHead>
              <TableHead>Applied At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs?.data.map((job, index) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{job.position}</TableCell>
                <TableCell>{job.company}</TableCell>
                <TableCell>{job.location ?? '-'}</TableCell>
                <TableCell>
                  {job.job_url ? 
                  <a href={job.job_url} target='_blank'>
                    <Button size="sm" variant='ghost' className='cursor-pointer bg-cyan-600'>
                          <Link2 className="w-4 h-4" />
                    </Button>
                  </a>
                  : '-'}
                </TableCell>
                <TableCell>{job.salary ?? '-'}</TableCell>
                <TableCell>{job.job_type ?? '-'}</TableCell>
                <TableCell>
                  {job.applied_at
                    ? dayjs(job.applied_at).format('MMM D, YYYY')
                    : '-'}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(job.status?.id)}>
                    {job.status?.name || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell className="text-center flex flex-row gap-2 items-center justify-end">
                  {/* Delete Button */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive" className='cursor-pointer'>
                        <Trash className="w-4 h-4" />
                      </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className='bg-red-500' onClick={() => {handleDelete(job.id)}}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  {/* ---Edit Form Model */}
                      <Link href={`/pekerjaan/${job.id}/edit`}>
                        <Button size="sm" variant="default" className='cursor-pointer'>
                            <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={8}>Total Jobs</TableCell>
              <TableCell className="text-right">{jobs.data.length}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <Pagination>
                <PaginationContent >
                    <PaginationItem>
                        <PaginationPrevious href={jobs?.prev_page_url || '#'} />
                    </PaginationItem>
                    <PaginationItem className='flex flex-row'>
                        {/* Hindari rendering ellipsis jika link-nya adalah "..." */}
                        {paginationLinks?.map((link, index) => (
                                <PaginationItem key={index}>
                                    {link.url === null && link.label.includes('...') ? (
                                        <PaginationEllipsis />
                                    ) : (
                                        <PaginationLink
                                            href={link.url || '#'}
                                            isActive={link.active}
                                        >
                                            {link.label}
                                        </PaginationLink>
                                    )}
                                </PaginationItem>
                            ))}
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                    <PaginationNext href={jobs?.next_page_url || '#'} />
                    </PaginationItem>
                </PaginationContent>
              </Pagination>
      </div>
    </AppLayout>
  );
}
