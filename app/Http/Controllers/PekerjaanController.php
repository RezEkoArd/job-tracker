<?php

namespace App\Http\Controllers;

use App\Models\Pekerjaan;
use App\Models\Status;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;


class PekerjaanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Pekerjaan::query();

        // Search functionality - mencari di position, company, dan location
        if ($request->filled('search')){
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('position','like',"%{$searchTerm}%")
                    ->orWhere('company','like',"%{$searchTerm}%")
                    ->orWhere('location','like',"%{$searchTerm}%");
            });
        }

        // Filter by status
        if ($request->filled('status_id')) {
            $query->where('status_id', $request->status);
        }


        //Get Result with paginate
        $jobs = $query->with('status')->latest()->paginate(10)->withQueryString();

        return Inertia::render('pekerjaan/index',[
            'jobs' => $jobs,
            'statuses' => Status::all(), // Sesuaikan dengan model Status Anda
            'filters' => $request->only(['search', 'status']) // Kirim current filters ke frontend
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('pekerjaan/create', [
            'statuses' => Status::select('name', 'id') -> orderBy('name')->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'position'   => 'required|string|max:255',
            'company'    => 'required|string|max:255',
            'location'   => 'nullable|string|max:255',
            'job_url'    => 'nullable|url|max:255',
            'salary'     => 'nullable|string|max:50',
            'job_type'   => 'nullable|string|max:50',
            'applied_at' => 'required|date',
            'status_id'  => 'required|exists:statuses,id',
            // 'user_id'    => 'required|exists:users,id', // Remove this validation if not sent from frontend
        ]);

        // Add the authenticated user's ID
        $validated['user_id'] = Auth::id(); // This assumes the user is logged in
        Pekerjaan::create($validated);

        return redirect()->route('pekerjaan.index')
            ->with('message', 'Data pekerjaan berhasil disimpan!');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id, Pekerjaan $pekerjaan)
    {

        return Inertia::render('pekerjaan/edit',[
                'job' => $pekerjaan->find($id),
            'statuses' => Status::select('name', 'id')->orderBy('name')->get()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $job = Pekerjaan::findOrFail($id); 

        // Validate 
        $validate = $request->validate([
            'position'   => 'required|string|max:255',
            'company'    => 'required|string|max:255',
            'location'   => 'nullable|string|max:255',
            'job_url'    => 'nullable|url|max:255',
            'salary'     => 'nullable|string|max:50',
            'job_type'   => 'nullable|string|max:50',
            'applied_at' => 'required|date',
            'status_id'  => 'required|exists:statuses,id',
        ]);

        $job->update([
            'position' => $validate['position'],
            'company' => $validate['company'],
            'location' => $validate['location'],
            'job_url' => $validate['job_url'],
            'salary' => $validate['salary'],
            'job_type' => $validate['job_type'],
            'applied_at' => $validate['applied_at'],
            'status_id' => $validate['status_id'],
        ]);

        return redirect()->route('pekerjaan.index')->with('message', 'Tracker Job updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $pekerjaan = Pekerjaan::find($id);

        if(!$pekerjaan) {
            return back()->with(['errorMsg' => 'Employee no found.']);
        }

        $pekerjaan->delete();
        return back()->with('message', 'Employee deleted successfully!');
    }
}
