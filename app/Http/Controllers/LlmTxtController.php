<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\Project;
use App\Models\CaseStudy;
use App\Models\BlogPost;
use App\Models\Skill;
use App\Models\Experience;
use Illuminate\Http\Response;

class LlmTxtController extends Controller
{
    /**
     * Generate standard /llms.txt summary for LLMs and AI Search Engines.
     */
    public function index(): Response
    {
        $profile = Profile::first();
        $name = $profile?->name ?? 'Developer';
        $role = $profile?->role ?? 'Full-Stack Developer';
        $summary = $profile?->summary ?? '';
        $location = $profile?->location ?? '';
        $email = $profile?->email ?? '';
        $socialLinks = $profile?->social_links ?? [];

        $siteUrl = url('/');
        $fullContextUrl = url('/llms-full.txt');
        $jsonProfileUrl = url('/developer.json');

        $globalSeo = \App\Models\SeoSetting::where('page_key', 'global')->first();
        $llmInstructions = $globalSeo?->llm_instructions;

        $out = "# {$name} - {$role}\n\n";
        $out .= "> {$summary}\n\n";

        if ($llmInstructions) {
            $out .= "## Special Instructions for AI & Recruiting Agents\n";
            $out .= "> {$llmInstructions}\n\n";
        }

        $out .= "## About & Identity\n";
        $out .= "- **Name**: {$name}\n";
        $out .= "- **Role**: {$role}\n";
        if ($location) {
            $out .= "- **Location**: {$location}\n";
        }
        if ($email) {
            $out .= "- **Contact Email**: {$email}\n";
        }
        $out .= "- **Canonical URL**: {$siteUrl}\n";
        $out .= "- **Full AI Context**: {$fullContextUrl}\n";
        $out .= "- **Machine-Readable Profile (JSON)**: {$jsonProfileUrl}\n\n";

        if (!empty($socialLinks)) {
            $out .= "### Social & Professional Profiles\n";
            foreach ($socialLinks as $platform => $url) {
                if ($url) {
                    $out .= "- **" . ucfirst($platform) . "**: {$url}\n";
                }
            }
            $out .= "\n";
        }

        // Core Pages
        $out .= "## Core Navigation & Key Endpoints\n";
        $out .= "- [Home]({$siteUrl}): Overview, highlights, terminal overview, featured work.\n";
        $out .= "- [About]({" . url('/about') . "}): In-depth biography, full work experience timeline, skills, and background.\n";
        $out .= "- [Work/Portfolio]({" . url('/work') . "}): Complete index of all projects, technical architectures, and code repositories.\n";
        $out .= "- [Case Studies]({" . url('/case-studies') . "}): Detailed technical case studies outlining architecture, challenges, and measurable impact.\n";
        $out .= "- [Articles & Blog]({" . url('/blog') . "}): Engineering blog posts, technical tutorials, and insights.\n";
        $out .= "- [Open Labs]({" . url('/open-labs') . "}): Open-source experiments, developer tools, and side projects.\n";
        $out .= "- [Roadmap]({" . url('/roadmap') . "}): Public development roadmap and feature trajectory.\n";
        $out .= "- [Contact & Booking]({" . url('/contact') . "}): Form and automated booking system to get in touch or schedule calls.\n\n";

        // Featured Projects
        $projects = Project::where('is_featured', true)->orderBy('year', 'desc')->get();
        if ($projects->isEmpty()) {
            $projects = Project::orderBy('year', 'desc')->take(4)->get();
        }
        if ($projects->isNotEmpty()) {
            $out .= "## Featured Projects\n";
            foreach ($projects as $project) {
                $pUrl = url("/work/{$project->slug}");
                $stack = is_array($project->stack) ? implode(', ', $project->stack) : $project->stack;
                $out .= "### [{$project->title}]({$pUrl})\n";
                $out .= "- **Year**: {$project->year}\n";
                $out .= "- **Summary**: {$project->summary}\n";
                if ($stack) {
                    $out .= "- **Tech Stack**: {$stack}\n";
                }
                if ($project->github_url) {
                    $out .= "- **GitHub**: {$project->github_url}\n";
                }
                $out .= "\n";
            }
        }

        // Case Studies
        $caseStudies = CaseStudy::where('is_published', true)->orderBy('created_at', 'desc')->get();
        if ($caseStudies->isNotEmpty()) {
            $out .= "## Case Studies\n";
            foreach ($caseStudies as $case) {
                $cUrl = url("/case-studies/{$case->slug}");
                $out .= "### [{$case->title}]({$cUrl})\n";
                $out .= "- **Client/Context**: " . ($case->client ?? 'Internal / Project') . " ({$case->year})\n";
                $out .= "- **Summary**: {$case->summary}\n";
                if ($case->stack) {
                    $stack = is_array($case->stack) ? implode(', ', $case->stack) : $case->stack;
                    $out .= "- **Tech Stack**: {$stack}\n";
                }
                $out .= "\n";
            }
        }

        // Recent Blog Articles
        $posts = BlogPost::orderBy('created_at', 'desc')->take(5)->get();
        if ($posts->isNotEmpty()) {
            $out .= "## Recent Articles\n";
            foreach ($posts as $post) {
                $postUrl = url("/blog/{$post->slug}");
                $dateStr = $post->created_at ? $post->created_at->format('Y-m-d') : '';
                $out .= "- [{$post->title}]({$postUrl})" . ($dateStr ? " ({$dateStr})" : "") . ": {$post->excerpt}\n";
            }
            $out .= "\n";
        }

        // Skills
        $skills = Skill::orderBy('created_at', 'asc')->get();
        if ($skills->isNotEmpty()) {
            $out .= "## Key Technical Skills\n";
            foreach ($skills as $skillCategory) {
                $items = is_array($skillCategory->items) ? implode(', ', $skillCategory->items) : $skillCategory->items;
                $out .= "- **{$skillCategory->category}**: {$items}\n";
            }
            $out .= "\n";
        }

        $out .= "---\n";
        $out .= "For complete deep text context including full blog post contents and detailed case studies, fetch: {$fullContextUrl}\n";

        return response($out, 200, [
            'Content-Type' => 'text/plain; charset=utf-8',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }

    /**
     * Generate full extended /llms-full.txt context for deep LLM retrieval.
     */
    public function full(): Response
    {
        $profile = Profile::first();
        $name = $profile?->name ?? 'Developer';
        $role = $profile?->role ?? 'Full-Stack Developer';

        $out = "# Complete LLM Knowledge Base for {$name} ({$role})\n\n";
        $out .= "This file contains the complete public context of {$name}'s software portfolio, including all published articles, case studies, project details, experience, and skills.\n\n";

        // Biography & Experience
        $out .= "## 1. Biography & Career Background\n";
        $out .= "{$profile?->summary}\n\n";

        $experiences = Experience::orderBy('created_at', 'desc')->get();
        if ($experiences->isNotEmpty()) {
            $out .= "### Professional Experience\n";
            foreach ($experiences as $exp) {
                $out .= "#### {$exp->role} at {$exp->company} ({$exp->period})\n";
                if ($exp->bullets && is_array($exp->bullets)) {
                    foreach ($exp->bullets as $bullet) {
                        $out .= "- {$bullet}\n";
                    }
                } elseif ($exp->bullets) {
                    $out .= "- {$exp->bullets}\n";
                }
                $out .= "\n";
            }
        }

        // Case Studies
        $caseStudies = CaseStudy::where('is_published', true)->orderBy('created_at', 'desc')->get();
        if ($caseStudies->isNotEmpty()) {
            $out .= "## 2. Technical Case Studies\n\n";
            foreach ($caseStudies as $case) {
                $out .= "### Case Study: {$case->title}\n";
                $out .= "- **URL**: " . url("/case-studies/{$case->slug}") . "\n";
                $out .= "- **Client**: " . ($case->client ?? 'N/A') . "\n";
                $out .= "- **Year**: {$case->year}\n";
                $out .= "- **Summary**: {$case->summary}\n\n";
                $out .= "#### Content Breakdown\n";
                $out .= "{$case->content}\n\n";
                $out .= "---\n\n";
            }
        }

        // Projects
        $projects = Project::orderBy('year', 'desc')->get();
        if ($projects->isNotEmpty()) {
            $out .= "## 3. Software Projects\n\n";
            foreach ($projects as $p) {
                $out .= "### Project: {$p->title}\n";
                $out .= "- **URL**: " . url("/work/{$p->slug}") . "\n";
                $out .= "- **Year**: {$p->year}\n";
                $out .= "- **Summary**: {$p->summary}\n";
                if ($p->github_url) {
                    $out .= "- **GitHub**: {$p->github_url}\n";
                }
                if ($p->highlights && is_array($p->highlights)) {
                    $out .= "- **Highlights**: " . implode('; ', $p->highlights) . "\n";
                }
                if ($p->description) {
                    $out .= "\n{$p->description}\n";
                }
                $out .= "\n---\n\n";
            }
        }

        // Blog Posts
        $posts = BlogPost::orderBy('created_at', 'desc')->get();
        if ($posts->isNotEmpty()) {
            $out .= "## 4. Published Engineering Articles & Blog Posts\n\n";
            foreach ($posts as $post) {
                $out .= "### Article: {$post->title}\n";
                $out .= "- **URL**: " . url("/blog/{$post->slug}") . "\n";
                $out .= "- **Date**: " . ($post->created_at ? $post->created_at->format('Y-m-d') : 'N/A') . "\n";
                $out .= "- **Excerpt**: {$post->excerpt}\n\n";
                $out .= "#### Article Content\n";
                $out .= "{$post->content}\n\n";
                $out .= "---\n\n";
            }
        }

        return response($out, 200, [
            'Content-Type' => 'text/plain; charset=utf-8',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }
}
