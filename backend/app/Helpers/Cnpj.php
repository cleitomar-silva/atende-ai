<?php

namespace App\Helpers;

class Cnpj
{
    public static function validate(string $cnpj): bool
    {
        $cnpj = preg_replace('/\D/', '', $cnpj);

        if (strlen($cnpj) !== 14) {
            return false;
        }

        if (preg_match('/(\d)\1{13}/', $cnpj)) {
            return false;
        }

        $weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        $weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

        $sum = 0;
        foreach ($weights1 as $i => $weight) {
            $sum += (int) $cnpj[$i] * $weight;
        }
        $digit1 = ($sum % 11) < 2 ? 0 : 11 - ($sum % 11);

        $sum = 0;
        foreach ($weights2 as $i => $weight) {
            $sum += (int) $cnpj[$i] * $weight;
        }
        $digit2 = ($sum % 11) < 2 ? 0 : 11 - ($sum % 11);

        return (int) $cnpj[12] === $digit1 && (int) $cnpj[13] === $digit2;
    }

    public static function onlyDigits(?string $cnpj): string
    {
        return (string) preg_replace('/\D/', '', $cnpj ?? '');
    }
}