<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Mensagens de Validação em Português (Brasil)
    |--------------------------------------------------------------------------
    |
    | As seguintes mensagens de idioma contêm as mensagens de erro padrão
    | usadas pela classe de validador. Algumas destas regras têm várias
    | versões, como as regras de tamanho. Sinta-se à vontade para ajustar
    | cada mensagem conforme as necessidades do seu aplicativo.
    |
    */

    'accepted' => 'O campo :attribute deve ser aceito.',
    'accepted_if' => 'O campo :attribute deve ser aceito quando :other é :value.',
    'active_url' => 'O campo :attribute não é uma URL válida.',
    'after' => 'O campo :attribute deve ser uma data posterior a :date.',
    'after_or_equal' => 'O campo :attribute deve ser uma data posterior ou igual a :date.',
    'alpha' => 'O campo :attribute deve conter apenas letras.',
    'alpha_dash' => 'O campo :attribute deve conter apenas letras, números, traços e underscores.',
    'alpha_num' => 'O campo :attribute deve conter apenas letras e números.',
    'array' => 'O campo :attribute deve ser uma matriz.',
    'ascii' => 'O campo :attribute deve conter apenas caracteres alfanuméricos e símbolos de byte único.',
    'before' => 'O campo :attribute deve ser uma data anterior a :date.',
    'before_or_equal' => 'O campo :attribute deve ser uma data anterior ou igual a :date.',
    'between' => [
        'array' => 'O campo :attribute deve ter entre :min e :max itens.',
        'file' => 'O campo :attribute deve ter entre :min e :max kilobytes.',
        'numeric' => 'O campo :attribute deve estar entre :min e :max.',
        'string' => 'O campo :attribute deve ter entre :min e :max caracteres.',
    ],
    'boolean' => 'O campo :attribute deve ser verdadeiro ou falso.',
    'can' => 'O campo :attribute contém um valor não autorizado.',
    'confirmed' => 'A confirmação do campo :attribute não coincide.',
    'contains' => 'O campo :attribute está faltando um valor obrigatório.',
    'current_password' => 'A senha está incorreta.',
    'date' => 'O campo :attribute não é uma data válida.',
    'date_equals' => 'O campo :attribute deve ser uma data igual a :date.',
    'date_format' => 'O campo :attribute não corresponde ao formato :format.',
    'decimal' => 'O campo :attribute deve ter :decimal casas decimais.',
    'declined' => 'O campo :attribute deve ser recusado.',
    'declined_if' => 'O campo :attribute deve ser recusado quando :other for :value.',
    'different' => 'O campo :attribute e :other devem ser diferentes.',
    'digits' => 'O campo :attribute deve ter :digits dígitos.',
    'digits_between' => 'O campo :attribute deve ter entre :min e :max dígitos.',
    'dimensions' => 'O campo :attribute tem dimensões de imagem inválidas.',
    'distinct' => 'O campo :attribute tem um valor duplicado.',
    'doesnt_end_with' => 'O campo :attribute não pode terminar com um dos seguintes: :values.',
    'doesnt_start_with' => 'O campo :attribute não pode começar com um dos seguintes: :values.',
    'email' => 'O campo :attribute deve ser um endereço de e-mail válido.',
    'ends_with' => 'O campo :attribute deve terminar com um dos seguintes: :values.',
    'enum' => 'O campo :attribute selecionado é inválido.',
    'exists' => 'O campo :attribute selecionado é inválido.',
    'extensions' => 'O campo :attribute deve ter uma das seguintes extensões: :values.',
    'file' => 'O campo :attribute deve ser um arquivo.',
    'filled' => 'O campo :attribute deve ter valor.',
    'gt' => [
        'array' => 'O campo :attribute deve ter mais de :value itens.',
        'file' => 'O campo :attribute deve ser maior que :value kilobytes.',
        'numeric' => 'O campo :attribute deve ser maior que :value.',
        'string' => 'O campo :attribute deve ser maior que :value caracteres.',
    ],
    'gte' => [
        'array' => 'O campo :attribute deve ter :value itens ou mais.',
        'file' => 'O campo :attribute deve ser maior ou igual a :value kilobytes.',
        'numeric' => 'O campo :attribute deve ser maior ou igual a :value.',
        'string' => 'O campo :attribute deve ser maior ou igual a :value caracteres.',
    ],
    'hex_color' => 'O campo :attribute deve ter uma cor hexadecimal válida.',
    'image' => 'O campo :attribute deve ser uma imagem.',
    'in' => 'O campo :attribute selecionado é inválido.',
    'in_array' => 'O campo :attribute não existe em :other.',
    'integer' => 'O campo :attribute deve ser um número inteiro.',
    'ip' => 'O campo :attribute deve ser um endereço IP válido.',
    'ipv4' => 'O campo :attribute deve ser um endereço IPv4 válido.',
    'ipv6' => 'O campo :attribute deve ser um endereço IPv6 válido.',
    'json' => 'O campo :attribute deve ser uma string JSON válida.',
    'lowercase' => 'O campo :attribute deve estar em minúsculas.',
    'lt' => [
        'array' => 'O campo :attribute deve ter menos de :value itens.',
        'file' => 'O campo :attribute deve ser menor que :value kilobytes.',
        'numeric' => 'O campo :attribute deve ser menor que :value.',
        'string' => 'O campo :attribute deve ser menor que :value caracteres.',
    ],
    'lte' => [
        'array' => 'O campo :attribute não deve ter mais de :value itens.',
        'file' => 'O campo :attribute deve ser menor ou igual a :value kilobytes.',
        'numeric' => 'O campo :attribute deve ser menor ou igual a :value.',
        'string' => 'O campo :attribute deve ser menor ou igual a :value caracteres.',
    ],
    'mac_address' => 'O campo :attribute deve ser um endereço MAC válido.',
    'max' => [
        'array' => 'O campo :attribute não deve ter mais de :max itens.',
        'file' => 'O campo :attribute não deve ser maior que :max kilobytes.',
        'numeric' => 'O campo :attribute não deve ser maior que :max.',
        'string' => 'O campo :attribute não deve ser maior que :max caracteres.',
    ],
    'max_digits' => 'O campo :attribute não deve ter mais de :max dígitos.',
    'mimes' => 'O campo :attribute deve ser um arquivo do tipo: :values.',
    'mimetypes' => 'O campo :attribute deve ser um arquivo do tipo: :values.',
    'min' => [
        'array' => 'O campo :attribute deve ter pelo menos :min itens.',
        'file' => 'O campo :attribute deve ter pelo menos :min kilobytes.',
        'numeric' => 'O campo :attribute deve ser pelo menos :min.',
        'string' => 'O campo :attribute deve ter pelo menos :min caracteres.',
    ],
    'min_digits' => 'O campo :attribute deve ter pelo menos :min dígitos.',
    'missing' => 'O campo :attribute deve estar ausente.',
    'missing_if' => 'O campo :attribute deve estar ausente quando :other é :value.',
    'missing_unless' => 'O campo :attribute deve estar ausente, a menos que :other seja :value.',
    'missing_with' => 'O campo :attribute deve estar ausente quando :values estiver presente.',
    'missing_with_all' => 'O campo :attribute deve estar ausente quando :values estiverem presentes.',
    'multiple_of' => 'O campo :attribute deve ser um múltiplo de :value.',
    'not_in' => 'O campo :attribute selecionado é inválido.',
    'not_regex' => 'O campo :attribute tem um formato inválido.',
    'numeric' => 'O campo :attribute deve ser um número.',
    'password' => [
        'letters' => 'O campo :attribute deve conter pelo menos uma letra.',
        'mixed' => 'O campo :attribute deve conter pelo menos uma letra maiúscula e uma minúscula.',
        'numbers' => 'O campo :attribute deve conter pelo menos um número.',
        'symbols' => 'O campo :attribute deve conter pelo menos um símbolo.',
        'uncompromised' => 'A senha informada em :attribute aparece em um vazamento de dados. Escolha uma senha diferente.',
    ],
    'present' => 'O campo :attribute deve estar presente.',
    'present_if' => 'O campo :attribute deve estar presente quando :other é :value.',
    'present_unless' => 'O campo :attribute deve estar presente, a menos que :other seja :value.',
    'present_with' => 'O campo :attribute deve estar presente quando :other estiver presente.',
    'present_with_all' => 'O campo :attribute deve estar presente quando :other estiverem presentes.',
    'prohibited' => 'O campo :attribute é proibido.',
    'prohibited_if' => 'O campo :attribute é proibido quando :other é :value.',
    'prohibited_unless' => 'O campo :attribute é proibido a menos que :other esteja em :values.',
    'prohibits' => 'O campo :attribute proíbe que :other esteja presente.',
    'regex' => 'O campo :attribute tem um formato inválido.',
    'required' => 'O campo :attribute é obrigatório.',
    'required_array_keys' => 'O campo :attribute deve conter entradas para: :values.',
    'required_if' => 'O campo :attribute é obrigatório quando :other é :value.',
    'required_if_accepted' => 'O campo :attribute é obrigatório quando :other foi aceito.',
    'required_if_declined' => 'O campo :attribute é obrigatório quando :other foi recusado.',
    'required_unless' => 'O campo :attribute é obrigatório a menos que :other esteja em :values.',
    'required_with' => 'O campo :attribute é obrigatório quando :values está presente.',
    'required_with_all' => 'O campo :attribute é obrigatório quando :values estão presentes.',
    'required_without' => 'O campo :attribute é obrigatório quando :values não está presente.',
    'required_without_all' => 'O campo :attribute é obrigatório quando nenhum dos :values estão presentes.',
    'same' => 'O campo :attribute e :other devem corresponder.',
    'size' => [
        'array' => 'O campo :attribute deve conter :size itens.',
        'file' => 'O campo :attribute deve ter :size kilobytes.',
        'numeric' => 'O campo :attribute deve ser :size.',
        'string' => 'O campo :attribute deve ter :size caracteres.',
    ],
    'starts_with' => 'O campo :attribute deve começar com um dos seguintes: :values.',
    'string' => 'O campo :attribute deve ser uma string.',
    'timezone' => 'O campo :attribute deve ser uma zona válida.',
    'ulid' => 'O campo :attribute deve ser um ULID válido.',
    'unique' => 'O valor do campo :attribute já está em uso.',
    'uploaded' => 'Falha ao enviar o campo :attribute.',
    'uppercase' => 'O campo :attribute deve estar em maiúsculas.',
    'url' => 'O campo :attribute deve ser uma URL válida.',
    'uuid' => 'O campo :attribute deve ser um UUID válido.',

    /*
    |--------------------------------------------------------------------------
    | Mensagens de validação personalizadas por atributo
    |--------------------------------------------------------------------------
    |
    | Aqui você pode especificar mensagens de validação personalizadas para
    | atributos usando a convenção "attribute.rule" para nomear as linhas.
    | Isso torna rápido especificar uma mensagem de idioma específica de
    | linha para um determinado atributo.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Atributos de validação personalizados
    |--------------------------------------------------------------------------
    |
    | As seguintes linhas de idioma são usadas para trocar o texto de
    | marcadores por algo mais amigável, como endereço de e-mail em vez de
    | "email". Isso simplesmente ajuda a tornar nossa mensagem mais expressiva.
    |
    */

    'attributes' => [
        'address' => 'endereço',
        'age' => 'idade',
        'body' => 'corpo',
        'city' => 'cidade',
        'cnpj' => 'CNPJ',
        'company_id' => 'empresa',
        'company_name' => 'nome da empresa',
        'counts_sla' => 'contagem de SLA',
        'email' => 'e-mail',
        'is_active' => 'status ativo',
        'name' => 'nome',
        'password' => 'senha',
        'password_confirmation' => 'confirmação de senha',
        'role' => 'permissão',
        'sector_id' => 'setor',
        'sector_ids' => 'setores',
        'sector_name' => 'nome do setor',
        'sla_minutes' => 'tempo de SLA',
        'group_id' => 'grupo',
        'category_id' => 'categoria',
        'classification_id' => 'classificação',
        'situation_id' => 'situação',
        'description' => 'descrição',
        'priority' => 'prioridade',
        'requesting_sector_id' => 'setor solicitante',
        'responsible_sector_id' => 'setor responsável',
        'responsible_user_id' => 'usuário responsável',
        'title' => 'título',
        'file' => 'arquivo',
        'color' => 'cor',
        'default_description' => 'descrição padrão',
        'sla_minutes' => 'tempo de SLA (minutos)',
        'request_deadline' => 'prazo',
        'attachment' => 'anexo',
        'comment' => 'comentário',
        'status' => 'status',
    ],

];