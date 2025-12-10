<?php

namespace Database\Seeders;

use App\Models\Paslon;
use App\Models\User;
use App\Models\Warga;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Paslon::create([
            'nama_ketua' => 'Anies Baswedan',
            'nama_wakil_ketua' => 'Muhaimin Iskandar',
            'visi' => 'Dalam dokumen visi-misi AMIN, pasangan ini menggambarkan visi mereka sebagai impian jutaan rakyat Indonesia, yaitu “Indonesia Adil Makmur untuk Semua.” Visi ini mencerminkan tekad untuk menciptakan keadilan dan kemakmuran yang merata di seluruh negeri.',
            'misi' => 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque autem reiciendis, porro atque nam accusantium. Saepe eius atque eaque fugit quis quia? Quae cupiditate, laudantium inventore aperiam itaque ratione esse molestiae ab dolor perspiciatis porro placeat labore unde, tenetur nemo vitae deleniti pariatur quisquam alias eveniet sequi accusamus. Inventore minima vitae expedita repellendus excepturi officia consequatur enim perspiciatis omnis asperiores. A, sapiente? Sit blanditiis quod, vel accusantium, amet esse natus, totam alias impedit quae dolor veniam illo architecto iusto dolorem expedita iure consectetur culpa. Debitis voluptate, magnam, error quidem sapiente numquam illo blanditiis, quos assumenda autem explicabo consectetur mollitia doloremque!'
        ]);
        Paslon::create([
            'nama_ketua' => 'Prabowo Subianto',
            'nama_wakil_ketua' => 'Gibran Rakabuming Raka',
            'visi' => 'Dalam dokumen visi-misi AMIN, pasangan ini menggambarkan visi mereka sebagai impian jutaan rakyat Indonesia, yaitu “Indonesia Adil Makmur untuk Semua.” Visi ini mencerminkan tekad untuk menciptakan keadilan dan kemakmuran yang merata di seluruh negeri.',
            'misi' => 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque autem reiciendis, porro atque nam accusantium. Saepe eius atque eaque fugit quis quia? Quae cupiditate, laudantium inventore aperiam itaque ratione esse molestiae ab dolor perspiciatis porro placeat labore unde, tenetur nemo vitae deleniti pariatur quisquam alias eveniet sequi accusamus. Inventore minima vitae expedita repellendus excepturi officia consequatur enim perspiciatis omnis asperiores. A, sapiente? Sit blanditiis quod, vel accusantium, amet esse natus, totam alias impedit quae dolor veniam illo architecto iusto dolorem expedita iure consectetur culpa. Debitis voluptate, magnam, error quidem sapiente numquam illo blanditiis, quos assumenda autem explicabo consectetur mollitia doloremque!'
        ]);
        Paslon::create([
            'nama_ketua' => 'Ganjar Pranowo',
            'nama_wakil_ketua' => 'Ma\'ruf Amin',
            'visi' => 'Dalam dokumen visi-misi AMIN, pasangan ini menggambarkan visi mereka sebagai impian jutaan rakyat Indonesia, yaitu “Indonesia Adil Makmur untuk Semua.” Visi ini mencerminkan tekad untuk menciptakan keadilan dan kemakmuran yang merata di seluruh negeri.',
            'misi' => 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque autem reiciendis, porro atque nam accusantium. Saepe eius atque eaque fugit quis quia? Quae cupiditate, laudantium inventore aperiam itaque ratione esse molestiae ab dolor perspiciatis porro placeat labore unde, tenetur nemo vitae deleniti pariatur quisquam alias eveniet sequi accusamus. Inventore minima vitae expedita repellendus excepturi officia consequatur enim perspiciatis omnis asperiores. A, sapiente? Sit blanditiis quod, vel accusantium, amet esse natus, totam alias impedit quae dolor veniam illo architecto iusto dolorem expedita iure consectetur culpa. Debitis voluptate, magnam, error quidem sapiente numquam illo blanditiis, quos assumenda autem explicabo consectetur mollitia doloremque!'
        ]);

        Warga::create([
            'nik' => 'cb46aa542611fd3d74fdf5f41bef87b955028c4fd3fbf2bbe7d04410fdb6503b'
        ]);
        Warga::create([
            'nik' => 'af3cb1b8d80ad898d542685c1850ceb15dfca12420a7d0a8d31e57b7db501fad'
        ]);
        Warga::create([
            'nik' => '3201234567890213'
        ]);
    }
}
