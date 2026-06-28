<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SeoSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'page_key' => 'home',
                'page_title' => 'Sudhir Rajai | Senior Full Stack Developer',
                'meta_description' => 'Welcome to my digital portfolio. I am a Senior Full Stack Developer specializing in Laravel, React, Node, and modern web applications.',
                'meta_keywords' => 'Full Stack Developer, Laravel, React, Portfolio, Senior Developer, Web Development',
            ],
            [
                'page_key' => 'work',
                'page_title' => 'My Projects & Works',
                'meta_description' => 'Browse through a curated selection of my top projects, enterprise web applications, and technical systems built with modern stacks.',
                'meta_keywords' => 'Portfolio Projects, Web Apps, Case Studies, Laravel Work, React Work',
            ],
            [
                'page_key' => 'blog',
                'page_title' => 'Dev Blog & Technical Insights',
                'meta_description' => 'Read my thoughts, tutorials, and insights on web engineering, backend systems, React optimization, and DevOps.',
                'meta_keywords' => 'Coding Blog, Web Dev Blog, Tutorials, PHP Laravel tips, React best practices',
            ],
            [
                'page_key' => 'about',
                'page_title' => 'About Me | Experience & Career',
                'meta_description' => 'Learn more about my engineering career, core technical skills, work experiences, and educational background.',
                'meta_keywords' => 'Resume, Curriculum Vitae, About Sudhir Rajai, Developer Bio',
            ],
            [
                'page_key' => 'contact',
                'page_title' => 'Get In Touch | Let\'s Build Together',
                'meta_description' => 'Ready to build your next web application? Drop me a message to discuss projects, freelancing, or full-time roles.',
                'meta_keywords' => 'Contact developer, Hire full stack dev, Hire Laravel engineer, Project quote',
            ],
            [
                'page_key' => 'global',
                'page_title' => 'Global SEO Settings',
                'meta_description' => 'Global settings for search engine verification and visitor tracking.',
                'meta_keywords' => null,
            ],
        ];

        foreach ($settings as $item) {
            \App\Models\SeoSetting::updateOrCreate(
                ['page_key' => $item['page_key']],
                $item
            );
        }
    }
}
