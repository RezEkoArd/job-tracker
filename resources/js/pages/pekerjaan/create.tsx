import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { type FormEvent, useState } from 'react';
// import { format } from 'path'; // <-- 1. Dihapus: Import tidak perlu & salah
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create a Job Tracker',
        href: route('pekerjaan.create'), // Lebih baik menggunakan helper route
    },
];

// Fungsi ini sudah bagus, tidak perlu diubah
function formatDate(date: Date | undefined): string {
    if (!date) return '';
    return date.toLocaleDateString('en-GB', { // Menggunakan en-GB untuk format DD/MM/YYYY
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}

interface Status {
    id: number;
    name: string;
}

interface JobFormData {
    [key: string]: string | number | Date | undefined; // Add index signature
    position: string;
    company: string;
    location: string;
    job_url: string;
    salary: string;
    job_type: string;
    status_id: number;
    applied_at: Date | undefined;
}

interface PageProps extends Record<string, any> {
    statuses: Status[];
}

export default function CreatePekerjaan() {
    const { statuses } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors } = useForm<JobFormData>({
        position: '',
        company: '',
        location: '',
        job_url: '',
        salary: '',
        job_type: '',
        status_id: statuses[0]?.id || 1,
        applied_at: new Date(),
    });

    // State untuk kontrol UI Popover
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [comboboxOpen, setComboboxOpen] = useState(false);

    // Handler untuk pengiriman form
    function handleSubmit(e: FormEvent) {
        e.preventDefault(); 
        post(route('pekerjaan.store'));
    }

    // Cari status yang dipilih berdasarkan ID untuk ditampilkan di button
    const selectedStatus = statuses.find((status) => status.id === data.status_id);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Job Tracker" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                {/* 3. Menambahkan onSubmit handler */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* --- Input Fields --- */}
                    <div className="w-full md:w-1/2">
                        <Label htmlFor="position">Position</Label>
                        <Input
                            id="position"
                            name="position"
                            value={data.position} // <-- 4. Hubungkan ke state useForm
                            onChange={(e) => setData('position', e.target.value)}
                            className="mt-1"
                            placeholder="Enter job position"
                            required
                        />
                        {errors.position && <p className="text-sm text-red-600 mt-1">{errors.position}</p>}
                    </div>

                    <div className="w-full md:w-1/2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                            id="company"
                            name="company"
                            value={data.company} // <-- 4. Hubungkan ke state useForm
                            onChange={(e) => setData('company', e.target.value)}
                            className="mt-1"
                            placeholder="Enter Company Name"
                            required
                        />
                         {errors.company && <p className="text-sm text-red-600 mt-1">{errors.company}</p>}
                    </div>

                    <div className="w-full md:w-1/2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            name="location"
                            value={data.location} // <-- 4. Hubungkan ke state useForm
                            onChange={(e) => setData('location', e.target.value)}
                            className="mt-1"
                            placeholder="e.g., Jakarta, Indonesia"
                        />
                         {errors.location && <p className="text-sm text-red-600 mt-1">{errors.location}</p>}
                    </div>
                     <div className="w-full md:w-1/2">
                        <Label htmlFor="job_url">Job URL</Label>
                        <Input
                            id="job_url"
                            type="url"
                            name="job_url"
                            value={data.job_url} // <-- 4. Hubungkan ke state useForm
                            onChange={(e) => setData('job_url', e.target.value)}
                            className="mt-1"
                            placeholder="https://example.com/job/posting"
                        />
                         {errors.job_url && <p className="text-sm text-red-600 mt-1">{errors.job_url}</p>}
                    </div>


                    <div className="w-full md:w-1/2">
                        <Label htmlFor="salary">Salary (Optional)</Label>
                        <Input
                            id="salary"
                            name="salary"
                            value={data.salary} // <-- 4. Hubungkan ke state useForm
                            onChange={(e) => setData('salary', e.target.value)}
                            className="mt-1"
                            placeholder="e.g., IDR 10,000,000 - 15,000,000"
                        />
                         {errors.salary && <p className="text-sm text-red-600 mt-1">{errors.salary}</p>}
                    </div>

                    <div className="w-full md:w-1/2">
                        <Label htmlFor="job_type">Job Type</Label>
                        <Input
                            id="job_type"
                            name="job_type"
                            value={data.job_type} // <-- 4. Hubungkan ke state useForm
                            onChange={(e) => setData('job_type', e.target.value)}
                            className="mt-1"
                            placeholder="e.g., Full-time, Part-time, Contract"
                        />
                         {errors.job_type && <p className="text-sm text-red-600 mt-1">{errors.job_type}</p>}
                    </div>

                    {/* --- Date Picker --- */}
                    <div className="w-full md:w-1/2">
                        <Label htmlFor="applied_at" className="mb-2 block">Applied Date</Label>
                        {/* 6. State Popover diperbaiki */}
                        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        'w-full justify-start text-left font-normal',
                                        !data.applied_at && 'text-muted-foreground'
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {data.applied_at ? formatDate(data.applied_at) : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={data.applied_at}
                                    onSelect={(date) => {
                                        setData('applied_at', date); // <-- Langsung update useForm state
                                        setDatePickerOpen(false); // <-- Tutup popover setelah memilih
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.applied_at && <p className="text-sm text-red-600 mt-1">{errors.applied_at}</p>}
                    </div>

                    {/* --- Combobox --- */}
                    <div className="w-full md:w-1/2">
                        {/* 7. Label diperbaiki */}
                        <Label htmlFor="status_id">Status</Label>
                        {/* 6. State Popover diperbaiki */}
                        <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" role="combobox" aria-expanded={comboboxOpen} className="w-full justify-between mt-1">
                                    {selectedStatus ? selectedStatus.name : 'Select a status...'}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                <Command>
                                    <CommandInput placeholder="Search status..." />
                                    <CommandList>
                                        <CommandEmpty>No status found.</CommandEmpty>
                                        <CommandGroup>
                                            {statuses.map((status) => (
                                                <CommandItem
                                                    key={status.id}
                                                    value={status.name}
                                                    onSelect={() => {
                                                        // 8. Logika onSelect disederhanakan
                                                        setData('status_id', status.id);
                                                        setComboboxOpen(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            'mr-2 h-4 w-4',
                                                            // 9. Perbandingan yang benar
                                                            data.status_id === status.id ? 'opacity-100' : 'opacity-0'
                                                        )}
                                                    />
                                                    {status.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                         {errors.status_id && <p className="text-sm text-red-600 mt-1">{errors.status_id}</p>}
                    </div>

                    <div className="flex items-center gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Create Job Tracker'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}