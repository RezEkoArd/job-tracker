import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
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
import { Check, ChevronsUpDown, Link2, Pencil, Trash, Search, X } from 'lucide-react';
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
  filters: {
    search?: string;
    status?: string;
  }
}

export default function PekerjaanDashboard() {
  const { jobs, statuses, filters, flash } = usePage<PageProps>().props;
  const { delete: destroy} = useForm();
  
  // Search state
  const [searchTerm, setSearchTerm] = useState(filters?.search || '');
  const [statusFilter, setStatusFilter] = useState(filters?.status || '');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isStatusPopoverOpen, setIsStatusPopoverOpen] = useState(false);


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

  // Handle search with debounce
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      handleSearch();
    }, 300); // 300ms delay

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, statusFilter]);

  const handleSearch = () => {
    const params: any = {};
    
    if (searchTerm) {
      params.search = searchTerm;
    }
    
    if (statusFilter) {
      params.status = statusFilter;
    }

    // Reset to page 1 when searching
    router.get(route('pekerjaan.index'), params, {
      preserveState: true,
      replace: true,
    });
  };

  const clearSearch = () => {
    setSearchTerm('');
    setStatusFilter('');
    router.get(route('pekerjaan.index'), {}, {
      preserveState: true,
      replace: true,
    });
  };

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

  // Build pagination URLs with search parameters
  const buildPaginationUrl = (url: string | null) => {
    if (!url) return '#';

  const urlObj = new URL(url);
  const pageParam = urlObj.searchParams.get('page');

    
  const params: any = {};
  if (pageParam) {
    params.page = pageParam;
  }
  
  if (searchTerm) {
    params.search = searchTerm;
  }
  
  if (statusFilter) {
    params.status = statusFilter;
  }

    
  return route('pekerjaan.index', params);

  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Job Tracker List" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="flex justify-between items-center">
          <Link href="/pekerjaan/create">
            <Button variant="secondary" className="cursor-pointer">
              Create Job Tracker
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search & Filter
          </Button>
        </div>

        {/* Search and Filter Section */}
        {isSearchOpen && (
          <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="search">Search Jobs</Label>
                <Input
                  id="search"
                  placeholder="Search by position, company, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="min-w-[200px]">
  <Label htmlFor="status">Filter by Status</Label>
  <Popover open={isStatusPopoverOpen} onOpenChange={setIsStatusPopoverOpen}>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={isStatusPopoverOpen}
        className="w-full justify-between mt-1"
      >
        {statusFilter
          ? statuses?.find((status) => status.id.toString() === statusFilter)?.name
          : "Select status..."}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-[200px] p-0" align="start">
      <div className="max-h-[300px] overflow-y-auto">
        <div 
          className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            setStatusFilter('');
            setIsStatusPopoverOpen(false);
          }}
        >
          <Check className={cn("mr-2 h-4 w-4", statusFilter === '' ? "opacity-100" : "opacity-0")} />
          All Status
        </div>
        {statuses?.map((status) => (
          <div
            key={status.id}
            className="flex items-center px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              setStatusFilter(status.id.toString());
              setIsStatusPopoverOpen(false);
            }}
          >
            <Check className={cn("mr-2 h-4 w-4", statusFilter === status.id.toString() ? "opacity-100" : "opacity-0")} />
            {status.name}
          </div>
        ))}
      </div>
    </PopoverContent>
  </Popover>
</div>
              <Button 
                variant="outline" 
                onClick={clearSearch}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear
              </Button>
            </div>
            
            {/* Active filters display */}
            {(searchTerm || statusFilter) && (
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: "{searchTerm}"
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setSearchTerm('')}
                    />
                  </Badge>
                )}
                {statusFilter && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Status: {statuses?.find(s => s.id.toString() === statusFilter)?.name}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => setStatusFilter('')}
                    />
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}

        <Table>
          <TableCaption>
            {searchTerm || statusFilter 
              ? `Found ${jobs?.total || 0} job(s) matching your search criteria`
              : "A list of your recent job applications."
            }
          </TableCaption>
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
            {jobs?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  {searchTerm || statusFilter 
                    ? "No jobs found matching your search criteria." 
                    : "No job applications found."
                  }
                </TableCell>
              </TableRow>
            ) : (
              jobs?.data.map((job, index) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">
                    {((jobs.current_page - 1) * jobs.per_page) + index + 1}
                  </TableCell>
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
                              job application and remove your data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className='bg-red-500' onClick={() => {handleDelete(job.id)}}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    {/* Edit Button */}
                        <Link href={`/pekerjaan/${job.id}/edit`}>
                          <Button size="sm" variant="default" className='cursor-pointer'>
                              <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={8}>
                Total Jobs {searchTerm || statusFilter ? '(filtered)' : ''}
              </TableCell>
              <TableCell className="text-right">{jobs?.total || 0}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        {/* Pagination with search parameters */}
        {jobs && jobs.total > jobs.per_page && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                {jobs.prev_page_url ? (
                  <Link 
                    href={route('pekerjaan.index')} 
                    data={{
                      page: jobs.current_page - 1,
                      ...(searchTerm && { search: searchTerm }),
                      ...(statusFilter && { status: statusFilter })
                    }}
                    preserveState
                  >
                    <PaginationPrevious />
                  </Link>
                ) : (
                  <PaginationPrevious href="#" />
                )}
              </PaginationItem>
              
              <PaginationItem className='flex flex-row'>
                {paginationLinks?.map((link, index) => (
                  <PaginationItem key={index}>
                    {link.url === null && link.label.includes('...') ? (
                      <PaginationEllipsis />
                    ) : (
                      <Link 
                        href={route('pekerjaan.index')} 
                        data={{
                          page: link.label,
                          ...(searchTerm && { search: searchTerm }),
                          ...(statusFilter && { status: statusFilter })
                        }}
                        preserveState
                      >
                        <PaginationLink isActive={link.active}>
                          {link.label}
                        </PaginationLink>
                      </Link>
                    )}
                  </PaginationItem>
                ))}
              </PaginationItem>
              
              <PaginationItem>
                {jobs.next_page_url ? (
                  <Link 
                    href={route('pekerjaan.index')} 
                    data={{
                      page: jobs.current_page + 1,
                      ...(searchTerm && { search: searchTerm }),
                      ...(statusFilter && { status: statusFilter })
                    }}
                    preserveState
                  >
                    <PaginationNext />
                  </Link>
                ) : (
                  <PaginationNext href="#" />
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </AppLayout>
  );
}