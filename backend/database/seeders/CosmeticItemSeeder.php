<?php

namespace Database\Seeders;

use App\Models\CosmeticItem;
use Illuminate\Database\Seeder;

class CosmeticItemSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            // Avatars (3 free)
            ['category' => 'avatar', 'slug' => 'avatar-gorilla', 'name_key' => 'cosmetics.avatar.gorilla', 'preview_path' => 'cosmetics/avatars/gorilla.webp', 'banana_cost' => 0],
            ['category' => 'avatar', 'slug' => 'avatar-panda', 'name_key' => 'cosmetics.avatar.panda', 'preview_path' => 'cosmetics/avatars/panda.webp', 'banana_cost' => 0],
            ['category' => 'avatar', 'slug' => 'avatar-bunny', 'name_key' => 'cosmetics.avatar.bunny', 'preview_path' => 'cosmetics/avatars/bunny.webp', 'banana_cost' => 0],

            // Stickers (10 free)
            ['category' => 'sticker', 'slug' => 'sticker-star', 'name_key' => 'cosmetics.sticker.star', 'preview_path' => 'cosmetics/stickers/star.webp', 'banana_cost' => 0],
            ['category' => 'sticker', 'slug' => 'sticker-heart', 'name_key' => 'cosmetics.sticker.heart', 'preview_path' => 'cosmetics/stickers/heart.webp', 'banana_cost' => 0],
            ['category' => 'sticker', 'slug' => 'sticker-rainbow', 'name_key' => 'cosmetics.sticker.rainbow', 'preview_path' => 'cosmetics/stickers/rainbow.webp', 'banana_cost' => 0],
            ['category' => 'sticker', 'slug' => 'sticker-sun', 'name_key' => 'cosmetics.sticker.sun', 'preview_path' => 'cosmetics/stickers/sun.webp', 'banana_cost' => 0],
            ['category' => 'sticker', 'slug' => 'sticker-moon', 'name_key' => 'cosmetics.sticker.moon', 'preview_path' => 'cosmetics/stickers/moon.webp', 'banana_cost' => 0],
            ['category' => 'sticker', 'slug' => 'sticker-flower', 'name_key' => 'cosmetics.sticker.flower', 'preview_path' => 'cosmetics/stickers/flower.webp', 'banana_cost' => 0],
            ['category' => 'sticker', 'slug' => 'sticker-butterfly', 'name_key' => 'cosmetics.sticker.butterfly', 'preview_path' => 'cosmetics/stickers/butterfly.webp', 'banana_cost' => 0],
            ['category' => 'sticker', 'slug' => 'sticker-cloud', 'name_key' => 'cosmetics.sticker.cloud', 'preview_path' => 'cosmetics/stickers/cloud.webp', 'banana_cost' => 0],
            ['category' => 'sticker', 'slug' => 'sticker-fish', 'name_key' => 'cosmetics.sticker.fish', 'preview_path' => 'cosmetics/stickers/fish.webp', 'banana_cost' => 0],
            ['category' => 'sticker', 'slug' => 'sticker-bird', 'name_key' => 'cosmetics.sticker.bird', 'preview_path' => 'cosmetics/stickers/bird.webp', 'banana_cost' => 0],

            // Backgrounds (3 free)
            ['category' => 'background', 'slug' => 'bg-white', 'name_key' => 'cosmetics.background.white', 'preview_path' => 'cosmetics/backgrounds/white.webp', 'banana_cost' => 0],
            ['category' => 'background', 'slug' => 'bg-sky', 'name_key' => 'cosmetics.background.sky', 'preview_path' => 'cosmetics/backgrounds/sky.webp', 'banana_cost' => 0],
            ['category' => 'background', 'slug' => 'bg-grass', 'name_key' => 'cosmetics.background.grass', 'preview_path' => 'cosmetics/backgrounds/grass.webp', 'banana_cost' => 0],
        ];

        foreach ($items as $item) {
            CosmeticItem::firstOrCreate(['slug' => $item['slug']], $item);
        }
    }
}
