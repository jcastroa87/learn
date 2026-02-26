<?php

namespace Database\Seeders;

use App\Models\CosmeticItem;
use Illuminate\Database\Seeder;

class PurchasableCosmeticSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            // Purchasable avatars (10-25 bananas)
            ['category' => 'avatar', 'slug' => 'avatar-lion', 'name_key' => 'cosmetics.avatar.lion', 'preview_path' => 'cosmetics/avatars/lion.webp', 'banana_cost' => 15],
            ['category' => 'avatar', 'slug' => 'avatar-fox', 'name_key' => 'cosmetics.avatar.fox', 'preview_path' => 'cosmetics/avatars/fox.webp', 'banana_cost' => 20],
            ['category' => 'avatar', 'slug' => 'avatar-owl', 'name_key' => 'cosmetics.avatar.owl', 'preview_path' => 'cosmetics/avatars/owl.webp', 'banana_cost' => 10],
            ['category' => 'avatar', 'slug' => 'avatar-penguin', 'name_key' => 'cosmetics.avatar.penguin', 'preview_path' => 'cosmetics/avatars/penguin.webp', 'banana_cost' => 25],
            ['category' => 'avatar', 'slug' => 'avatar-unicorn', 'name_key' => 'cosmetics.avatar.unicorn', 'preview_path' => 'cosmetics/avatars/unicorn.webp', 'banana_cost' => 25],

            // Purchasable stickers (5-15 bananas)
            ['category' => 'sticker', 'slug' => 'sticker-rocket', 'name_key' => 'cosmetics.sticker.rocket', 'preview_path' => 'cosmetics/stickers/rocket.webp', 'banana_cost' => 8],
            ['category' => 'sticker', 'slug' => 'sticker-crown', 'name_key' => 'cosmetics.sticker.crown', 'preview_path' => 'cosmetics/stickers/crown.webp', 'banana_cost' => 10],
            ['category' => 'sticker', 'slug' => 'sticker-diamond', 'name_key' => 'cosmetics.sticker.diamond', 'preview_path' => 'cosmetics/stickers/diamond.webp', 'banana_cost' => 15],
            ['category' => 'sticker', 'slug' => 'sticker-lightning', 'name_key' => 'cosmetics.sticker.lightning', 'preview_path' => 'cosmetics/stickers/lightning.webp', 'banana_cost' => 5],
            ['category' => 'sticker', 'slug' => 'sticker-planet', 'name_key' => 'cosmetics.sticker.planet', 'preview_path' => 'cosmetics/stickers/planet.webp', 'banana_cost' => 12],

            // Purchasable backgrounds (15-30 bananas)
            ['category' => 'background', 'slug' => 'bg-ocean', 'name_key' => 'cosmetics.background.ocean', 'preview_path' => 'cosmetics/backgrounds/ocean.webp', 'banana_cost' => 20],
            ['category' => 'background', 'slug' => 'bg-space', 'name_key' => 'cosmetics.background.space', 'preview_path' => 'cosmetics/backgrounds/space.webp', 'banana_cost' => 25],
            ['category' => 'background', 'slug' => 'bg-jungle', 'name_key' => 'cosmetics.background.jungle', 'preview_path' => 'cosmetics/backgrounds/jungle.webp', 'banana_cost' => 15],
            ['category' => 'background', 'slug' => 'bg-sunset', 'name_key' => 'cosmetics.background.sunset', 'preview_path' => 'cosmetics/backgrounds/sunset.webp', 'banana_cost' => 30],
        ];

        foreach ($items as $item) {
            CosmeticItem::firstOrCreate(['slug' => $item['slug']], $item);
        }
    }
}
