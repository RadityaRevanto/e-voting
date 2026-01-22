<?php

namespace App\Http\Controllers;

use App\Helpers\ActivityLogHelper;
use App\Helpers\HttpStatus;
use App\Models\VoteGuideline;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class VoteGuidelineController extends Controller
{
    public function create(Request $request) {
        $validator = Validator::make($request->all(), ['text' => 'required|string']);
        if ($validator->fails()) return HttpStatus::code400();

        $guideline = VoteGuideline::create(['text' => $request->text]);

        ActivityLogHelper::createGuidelineLog(
            'Guideline dibuat id: ' .$guideline->id. ', text : ' .$guideline->text,
            $guideline->created_at
        );

        return response()->json([
            'success' => true,
            'message' => "Guideline created",
            'data' => $guideline,
        ], 200);
    }

    public function shows() {
        $guidelines = VoteGuideline::orderBy('id')->get();

        return response()->json([
            'success' => true,
            'message' => "Vote guidelines", 
            'data' => $guidelines,
        ], 200);
    }

    public function updateById(Request $request, int $id) {
        $validator = Validator::make($request->all(), ['text' => 'required|string']);
        if ($validator->fails()) return HttpStatus::code400();

        try {
            $guideline = VoteGuideline::findOrFail($id);
            
            $guideline->text = $request->text;
            $guideline->save();

            return response()->json([
                'success' => true,
                'message' => "Vote id=$id berhasil diubah",
                'data' => [],
            ], 200);
        } catch (\Throwable $th) {
            return HttpStatus::code400();
        }
    }

    public function swap(Request $request) {
        $validator = Validator::make($request->all(), [
            'from' => 'required|int',
            'to' => 'required|int',
        ]);
        if ($validator->fails()) return HttpStatus::code400();

        try {
            if ($request['from'] === $request['to']) {
                return HttpStatus::code422("Tidak bisa menukar guideline yang sama");
            }

            $guideline1 = VoteGuideline::findOrFail($request['from']);
            $guideline2 = VoteGuideline::findOrFail($request['to']);

            // Store temporary data
            $tempText = $guideline1->text;

            // Swap data using transaction
            DB::transaction(function () use ($guideline1, $guideline2, $tempText) {
                $guideline1->update(['text' => $guideline2->text]);
                $guideline2->update(['text' => $tempText]);
            });

            // Refresh models
            $guideline1->refresh();
            $guideline2->refresh();

            return response()->json([
                'success' => true,
                'message' => 'Guidelines swapped successfully',
                'data' => [
                    'guideline1' => $guideline1,
                    'guideline2' => $guideline2
                ]
            ], 200);
        } catch (\Throwable $th) {
            return HttpStatus::code500();
        }
    }


    public function deleteById(int $id) {
        try {
            $guideline = VoteGuideline::findOrFail($id);
            $guideline->delete();

            ActivityLogHelper::deleteGuidelineLog(
                'Guideline dihapus id: ' .$guideline->id. ', text : ' .$guideline->text,
            );
            
            return response()->json([
                'success' => true,
                'message' => "Vote Guideline id=$id berhasil dihapus",
                'data' => [],
            ], 200);
        } catch (\Throwable $th) {
            return HttpStatus::code404();
        }
    }
}
