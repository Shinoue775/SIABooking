<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LandingController extends Controller
{
    public function index()
    {
        // WRONG - this is looking for a file called 'app.blade.php'
        // return view('app.blade.php');
        
        // CORRECT - this uses the layout system
        return view('pages.landing');
    }
}