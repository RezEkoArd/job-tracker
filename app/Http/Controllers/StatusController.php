<?php

namespace App\Http\Controllers;

use App\Models\Status;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StatusController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $statuses = Status::latest()->get();
        return Inertia::render('status/index', compact('statuses'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('status/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //Validate the request data
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Create a new status
        Status::create([
            'name'=> $request->name,
        ]);

        return redirect()->route('status.index')->with('message', 'Status created successfully.');
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
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $status = Status::findOrFail($id);

        // check if the status is associated with any jobs
        // if ($department->employees()->count() > 0) {
        //     return redirect()->route('departments.index')->with('errorMsg', 'Department cannot be deleted because it has '.$department->employees()->count().' employee(s) associated with it.');
        // }

        $status->delete();

        return redirect()->route('status.index')->with('message', 'Status deleted successfully.');
    }
}
