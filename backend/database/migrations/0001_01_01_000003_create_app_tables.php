<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('child_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->constrained('parents')->index();
            $table->string('name', 100);
            $table->smallInteger('age');
            $table->string('avatar', 50);
            $table->string('language', 5)->default('es');
            $table->integer('bananas')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['parent_id', 'deleted_at']);
        });

        Schema::create('progress_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_profile_id')->constrained()->index();
            $table->string('module_type', 30);
            $table->string('item_identifier', 50);
            $table->string('status', 20)->default('attempted');
            $table->jsonb('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['child_profile_id', 'module_type']);
            $table->unique(['child_profile_id', 'module_type', 'item_identifier']);
        });

        Schema::create('artworks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_profile_id')->constrained()->index();
            $table->string('activity_type', 20);
            $table->string('file_path', 500);
            $table->integer('file_size');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['child_profile_id', 'created_at']);
        });

        Schema::create('cosmetic_items', function (Blueprint $table) {
            $table->id();
            $table->string('category', 20);
            $table->string('slug', 50)->unique();
            $table->string('name_key', 100);
            $table->string('preview_path', 500);
            $table->integer('banana_cost')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index('category');
        });

        Schema::create('child_cosmetics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_profile_id')->constrained()->index();
            $table->foreignId('cosmetic_item_id')->constrained()->index();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['child_profile_id', 'cosmetic_item_id']);
        });

        Schema::create('session_configs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_profile_id')->unique()->constrained()->index();
            $table->smallInteger('time_limit_minutes')->default(20);
            $table->boolean('sound_enabled')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('session_configs');
        Schema::dropIfExists('child_cosmetics');
        Schema::dropIfExists('cosmetic_items');
        Schema::dropIfExists('artworks');
        Schema::dropIfExists('progress_records');
        Schema::dropIfExists('child_profiles');
    }
};
