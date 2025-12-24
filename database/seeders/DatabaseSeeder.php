<?php

namespace Database\Seeders;

use App\Models\Paslon;
use App\Models\User;
use App\Models\Warga;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create super admin (updateOrCreate untuk menghindari duplicate)
        User::updateOrCreate(
            ['email' => 'admin@evoting.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('admin123'),
                'role' => 'super_admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin2@evoting.com'],
            [
                'name' => 'Admin 2',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin3@evoting.com'],
            [
                'name' => 'Admin 3',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );
        
        User::updateOrCreate(
            ['email' => 'paslon1@evoting.com'],
            [
                'name' => 'Anies - Amin',
                'password' => Hash::make('anisamin'),
                'role' => 'paslon',
            ]
        );
        
        User::updateOrCreate(
            ['email' => 'voter1@evoting.com'],
            [
                'name' => 'Komputer 1',
                'password' => Hash::make('voter123'),
                'role' => 'voter',
            ]
        );

        // Create paslon
        Paslon::create([
            'user_id' => '4',
            'nama_ketua' => 'Anies Baswedan',
            'nama_wakil_ketua' => 'Muhaimin Iskandar',
            'visi' => 'Dalam dokumen visi-misi AMIN, pasangan ini menggambarkan visi mereka sebagai impian jutaan rakyat Indonesia, yaitu "Indonesia Adil Makmur untuk Semua." Visi ini mencerminkan tekad untuk menciptakan keadilan dan kemakmuran yang merata di seluruh negeri.',
            'misi' => 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque autem reiciendis, porro atque nam accusantium. Saepe eius atque eaque fugit quis quia? Quae cupiditate, laudantium inventore aperiam itaque ratione esse molestiae ab dolor perspiciatis porro placeat labore unde, tenetur nemo vitae deleniti pariatur quisquam alias eveniet sequi accusamus. Inventore minima vitae expedita repellendus excepturi officia consequatur enim perspiciatis omnis asperiores. A, sapiente? Sit blanditiis quod, vel accusantium, amet esse natus, totam alias impedit quae dolor veniam illo architecto iusto dolorem expedita iure consectetur culpa. Debitis voluptate, magnam, error quidem sapiente numquam illo blanditiis, quos assumenda autem explicabo consectetur mollitia doloremque!'
        ]);
        // Paslon::create([
        //     'nama_ketua' => 'Prabowo Subianto',
        //     'nama_wakil_ketua' => 'Gibran Rakabuming Raka',
        //     'visi' => 'Dalam dokumen visi-misi AMIN, pasangan ini menggambarkan visi mereka sebagai impian jutaan rakyat Indonesia, yaitu "Indonesia Adil Makmur untuk Semua." Visi ini mencerminkan tekad untuk menciptakan keadilan dan kemakmuran yang merata di seluruh negeri.',
        //     'misi' => 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque autem reiciendis, porro atque nam accusantium. Saepe eius atque eaque fugit quis quia? Quae cupiditate, laudantium inventore aperiam itaque ratione esse molestiae ab dolor perspiciatis porro placeat labore unde, tenetur nemo vitae deleniti pariatur quisquam alias eveniet sequi accusamus. Inventore minima vitae expedita repellendus excepturi officia consequatur enim perspiciatis omnis asperiores. A, sapiente? Sit blanditiis quod, vel accusantium, amet esse natus, totam alias impedit quae dolor veniam illo architecto iusto dolorem expedita iure consectetur culpa. Debitis voluptate, magnam, error quidem sapiente numquam illo blanditiis, quos assumenda autem explicabo consectetur mollitia doloremque!'
        // ]);
        // Paslon::create([
        //     'nama_ketua' => 'Ganjar Pranowo',
        //     'nama_wakil_ketua' => 'Ma\'ruf Amin',
        //     'visi' => 'Dalam dokumen visi-misi AMIN, pasangan ini menggambarkan visi mereka sebagai impian jutaan rakyat Indonesia, yaitu "Indonesia Adil Makmur untuk Semua." Visi ini mencerminkan tekad untuk menciptakan keadilan dan kemakmuran yang merata di seluruh negeri.',
        //     'misi' => 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque autem reiciendis, porro atque nam accusantium. Saepe eius atque eaque fugit quis quia? Quae cupiditate, laudantium inventore aperiam itaque ratione esse molestiae ab dolor perspiciatis porro placeat labore unde, tenetur nemo vitae deleniti pariatur quisquam alias eveniet sequi accusamus. Inventore minima vitae expedita repellendus excepturi officia consequatur enim perspiciatis omnis asperiores. A, sapiente? Sit blanditiis quod, vel accusantium, amet esse natus, totam alias impedit quae dolor veniam illo architecto iusto dolorem expedita iure consectetur culpa. Debitis voluptate, magnam, error quidem sapiente numquam illo blanditiis, quos assumenda autem explicabo consectetur mollitia doloremque!'
        // ]);

        // Create warga (updateOrCreate untuk menghindari duplicate)
        Warga::firstOrCreate([
            'nik' => hash('sha256', '3201234567890001')
        ]);
        Warga::firstOrCreate([
            'nik' => hash('sha256', '3201234567890002')
        ]);
        Warga::firstOrCreate([
            'nik' => hash('sha256', '3201234567890003')
        ]);
    }
}
