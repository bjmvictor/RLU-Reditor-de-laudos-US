/**
 * Definições Expandidas de Exames Ultrassonográficos
 * Baseado em: Compêndio da Radiologia
 * 
 * Estrutura completa hierárquica de todos os tipos de exames disponíveis
 */

export interface FindingDefinition {
  id: string;
  label: string;
  requiresSize?: boolean;
  hasLaterality?: boolean;
  hasQuantity?: boolean;
  hasCharacteristics?: string[];
  alteredText: string;
  conclusionText?: string;
  observations?: string;
}

export interface ExamCategory {
  name: string;
  defaultNormalText: string;
  findings: FindingDefinition[];
}

export const EXPANDED_EXAM_DEFINITIONS: { [key: string]: ExamCategory[] } = {
  // ========================================
  // ULTRASSOM GERAL - CERVICAL
  // ========================================
  "US Cervical - Tireoide": [
    {
      name: "Tireoide",
      defaultNormalText: "Tireoide com dimensões normais, contornos regulares, ecotextura homogênea e simétrica, sem nódulos, cistos ou sinais de inflamação.",
      findings: [
        {
          id: "tireoide-normal",
          label: "Normal",
          alteredText: "Tireoide com dimensões normais, contornos regulares, ecotextura homogênea e simétrica, sem nódulos, cistos ou sinais de inflamação.",
          conclusionText: "Tireoide sem alterações."
        },
        {
          id: "tireoidite-autoimune",
          label: "Tireoidite Autoimune (Hashimoto)",
          alteredText: "Parênquima apresenta textura heterogênea, observando-se áreas de menor ecogenicidade de permeio de limites mal definidos (podendo traduzir áreas de infiltrado linfocítico). Ao mapeamento dúplex-Doppler colorido, observa-se vascularização difusamente aumentada.",
          conclusionText: "Alteração textural tireoidiana difusa e hipervascularização ao mapeamento colorido. Este padrão é compatível com tireoidite autoimune."
        },
        {
          id: "nodulo-tireoidiano",
          label: "Nódulo Tireoidiano",
          requiresSize: true,
          hasLaterality: true,
          hasQuantity: true,
          hasCharacteristics: ["Hipoecogênico", "Isoecogênico", "Hiperecogênico", "Heterogêneo", "Circunscrito", "Com halo", "Sem halo", "Com microcalcificações", "Sem microcalcificações"],
          alteredText: "Nódulo tireoidiano, circunscrito, sem halo hipoecóico ou calcificações.",
          conclusionText: "Nódulo tireoidiano. Sugere-se avaliação endocrinológica e, se necessário, punção aspirativa por agulha fina (PAAF)."
        },
        {
          id: "cisto-tireoidiano",
          label: "Cisto Tireoidiano",
          requiresSize: true,
          hasLaterality: true,
          hasQuantity: true,
          alteredText: "Cisto tireoidiano de paredes finas e conteúdo anecóico.",
          conclusionText: "Cisto tireoidiano. Geralmente benigno, acompanhamento conforme critério clínico."
        },
        {
          id: "hipotireoidismo",
          label: "Hipotireoidismo",
          alteredText: "Tireoide de dimensões reduzidas e contornos regulares. Parênquima com ecogenicidade reduzida e difusamente heterogêneo sem a caracterização de lesões focais definidas.",
          conclusionText: "Os aspectos descritos são compatíveis com diagnóstico clínico proposto de tireoidite."
        }
      ]
    },
    {
      name: "Glândulas Submandibulares",
      defaultNormalText: "Glândulas submandibulares com dimensões, contornos e ecotextura normais.",
      findings: [
        {
          id: "submandibulares-normal",
          label: "Normal",
          alteredText: "Glândulas submandibulares com dimensões, contornos e ecotextura normais.",
          conclusionText: "Glândulas submandibulares sem alterações."
        },
        {
          id: "sialoadenite",
          label: "Sialoadenite",
          hasLaterality: true,
          alteredText: "Morfologia globosa, contornos pouco irregulares e dimensões discretamente aumentadas. Ecotextura glandular difusamente heterogênea. Ao mapeamento colorido observa-se vascularização aumentada.",
          conclusionText: "Sinais ultrassonográficos de sialoadenite submandibular."
        }
      ]
    },
    {
      name: "Linfonodos Cervicais",
      defaultNormalText: "Linfonodos cervicais de aspecto e dimensões habituais.",
      findings: [
        {
          id: "linfonodos-normal",
          label: "Normal",
          alteredText: "Linfonodos cervicais de aspecto e dimensões habituais.",
          conclusionText: "Linfonodos cervicais sem alterações."
        },
        {
          id: "linfondomegalia",
          label: "Linfondomegalia",
          requiresSize: true,
          hasQuantity: true,
          alteredText: "Observam-se múltiplos linfonodos submandibulares e cervicais com aspecto hipoecóico e dimensões aumentadas.",
          conclusionText: "Linfondomegalia cervical. Correlacionar com dados clínicos."
        }
      ]
    },
    {
      name: "Glândulas Parótidas",
      defaultNormalText: "Glândulas parótidas com forma, contornos, topografia e dimensões normais.",
      findings: [
        {
          id: "parotidas-normal",
          label: "Normal",
          alteredText: "Glândulas parótidas com forma, contornos, topografia e dimensões normais.",
          conclusionText: "Glândulas parótidas sem alterações."
        },
        {
          id: "parotidite",
          label: "Parotidite",
          hasLaterality: true,
          alteredText: "Glândulas parótidas têm forma, contornos e topografia normais, notando-se aumento das dimensões da parótida, que apresenta fina alteração exotextural.",
          conclusionText: "Sinais sugestivos de parotidite."
        }
      ]
    }
  ],

  // ========================================
  // ULTRASSOM GERAL - ABDOME
  // ========================================
  "US Abdome - Total": [
    {
      name: "Fígado",
      defaultNormalText: "Fígado com dimensões normais, contornos regulares e ecotextura dentro dos padrões habituais. Veias hepáticas e ramos portais preservados. Veia porta de calibre normal (até 1,2 cm).",
      findings: [
        {
          id: "figado-normal",
          label: "Normal",
          alteredText: "Fígado com dimensões normais, contornos regulares e ecotextura dentro dos padrões habituais. Veias hepáticas e ramos portais preservados. Veia porta de calibre normal (até 1,2 cm).",
          conclusionText: "Fígado sem alterações."
        },
        {
          id: "esteatose-hepatica",
          label: "Esteatose Hepática",
          alteredText: "Fígado de dimensões normais, contornos regulares, apresentando aumento difuso da ecogenicidade do parênquima, com atenuação do feixe acústico posterior, sem a caracterização de lesões focais bem definidas.",
          conclusionText: "Esteatose hepática (infiltração gordurosa). Recomenda-se acompanhamento clínico e controle de fatores de risco.",
          observations: "Grau: Leve/Moderado/Acentuado"
        },
        {
          id: "hepatopatia-parenquimatosa",
          label: "Hepatopatia Parenquimatosa",
          alteredText: "Fígado de dimensões normais, contornos serrilhados, bordas rombas e ecotextura discretamente heterogênea. Não são caracterizadas lesões focais bem definidas.",
          conclusionText: "Hepatopatia parenquimatosa. Correlacionar com dados clínicos e laboratoriais."
        },
        {
          id: "cirrose-hepatica",
          label: "Cirrose Hepática",
          alteredText: "Fígado de dimensões reduzidas, com sinais de hipertrofia compensatória dos lobos caudado e esquerdo. Apresenta contornos serrilhados e ecotextura difusamente heterogênea.",
          conclusionText: "Sinais morfológicos de cirrose hepática. Correlacionar com dados clínicos."
        },
        {
          id: "cisto-hepatico",
          label: "Cisto Hepático",
          requiresSize: true,
          hasQuantity: true,
          alteredText: "Cisto de paredes finas e conteúdo anecóico localizado no fígado.",
          conclusionText: "Cisto hepático simples. Geralmente benigno, sem necessidade de acompanhamento."
        },
        {
          id: "hemangioma-hepatico",
          label: "Hemangioma",
          requiresSize: true,
          hasQuantity: true,
          alteredText: "Nódulo hiperecogênico, circunscrito, localizado no fígado, considerar a possibilidade de hemangioma.",
          conclusionText: "Nódulo hepático de aspecto sugestivo de hemangioma. Correlacionar com exames complementares se necessário."
        },
        {
          id: "calcificacao-hepatica",
          label: "Calcificação Hepática",
          requiresSize: true,
          alteredText: "Foco de calcificação de aspecto residual localizado no fígado.",
          conclusionText: "Calcificação hepática de aspecto residual, provavelmente benigna."
        },
        {
          id: "hipertensao-portal",
          label: "Hipertensão Portal",
          alteredText: "Veia porta de calibre aumentado. Recanalização da veia paraumbilical. Circulação colateral perigástrica e no hilo esplênico.",
          conclusionText: "Sinais ultrassonográficos de hipertensão portal."
        }
      ]
    },
    {
      name: "Vesícula Biliar",
      defaultNormalText: "Vesícula biliar normodistendida, de paredes finas, anecóica, sem cálculos ou dilatação de vias biliares.",
      findings: [
        {
          id: "vesicula-normal",
          label: "Normal",
          alteredText: "Vesícula biliar normodistendida, de paredes finas, anecóica, sem cálculos ou dilatação de vias biliares.",
          conclusionText: "Vesícula biliar sem alterações."
        },
        {
          id: "colelities",
          label: "Colelitíase (Cálculos)",
          requiresSize: true,
          hasQuantity: true,
          alteredText: "Vesícula biliar normodistendida, de paredes finas, apresentando cálculo(s) móvel(is) em seu interior.",
          conclusionText: "Colelitíase. Recomenda-se avaliação cirúrgica para colecistectomia, se sintomático.",
          observations: "Cálculos móveis à mudança de decúbito"
        },
        {
          id: "bile-tumefacta",
          label: "Bile Tumefacta (Barro Biliar)",
          alteredText: "Vesícula biliar normodistendida, de paredes finas, contendo sedimento ecogênico amorfo depositado em seu interior, sem imagens calculosas.",
          conclusionText: "Bile tumefacta (barro biliar). Acompanhamento clínico."
        },
        {
          id: "polipo-vesicular",
          label: "Pólipo/Colesterolose",
          requiresSize: true,
          alteredText: "Observa-se imagem nodular hiperecogênica fixa à parede vesicular, devendo corresponder a colesterolose ou a pequeno pólipo.",
          conclusionText: "Pólipo vesicular ou colesterolose. Acompanhamento conforme critério clínico."
        },
        {
          id: "colecistite",
          label: "Colecistite",
          alteredText: "Vesícula biliar distendida, apresentando paredes espessadas (espessura > 3mm), forma e contornos preservados. Presença de imagens compatíveis com cálculos em seu interior.",
          conclusionText: "Sinais ultrassonográficos de colecistite aguda. Correlacionar com dados clínicos.",
          observations: "Sinal de Murphy ultrassonográfico pode estar presente"
        },
        {
          id: "colecistectomia",
          label: "Pós-Colecistectomia",
          alteredText: "Vesícula biliar não caracterizada (status pós-operatório). Há pequena dilatação das vias biliares intra e extra-hepáticas, habitualmente observada no pós-operatório.",
          conclusionText: "Status pós-colecistectomia."
        }
      ]
    },
    {
      name: "Pâncreas",
      defaultNormalText: "Pâncreas com dimensões normais, contornos definidos e ecotextura homogênea.",
      findings: [
        {
          id: "pancreas-normal",
          label: "Normal",
          alteredText: "Pâncreas com dimensões normais, contornos definidos e ecotextura homogênea.",
          conclusionText: "Pâncreas sem alterações."
        },
        {
          id: "pancreas-obscurecido",
          label: "Avaliação Prejudicada (Gás)",
          alteredText: "Avaliação do pâncreas prejudicada devido à interposição gasosa intestinal.",
          conclusionText: "Pâncreas com avaliação parcial devido a gás intestinal."
        }
      ]
    },
    {
      name: "Baço",
      defaultNormalText: "Baço com dimensões normais (até 11-12 cm), morfologia habitual e ecotextura homogênea.",
      findings: [
        {
          id: "baco-normal",
          label: "Normal",
          alteredText: "Baço com dimensões normais, morfologia habitual e ecotextura homogênea.",
          conclusionText: "Baço sem alterações."
        },
        {
          id: "esplenomegalia",
          label: "Esplenomegalia",
          requiresSize: true,
          alteredText: "Baço com dimensões aumentadas, morfologia habitual e ecotextura homogênea.",
          conclusionText: "Esplenomegalia. Correlacionar com dados clínicos."
        },
        {
          id: "baco-acessorio",
          label: "Baço Acessório",
          requiresSize: true,
          alteredText: "Baço acessório localizado próximo ao hilo esplênico.",
          conclusionText: "Baço acessório, achado benigno."
        },
        {
          id: "cisto-esplenico",
          label: "Cisto Esplênico",
          requiresSize: true,
          alteredText: "Baço com dimensões conservadas, morfologia habitual e ecotextura homogênea exceto por cisto de paredes finas e conteúdo anecóico.",
          conclusionText: "Cisto esplênico simples."
        },
        {
          id: "calcificacao-esplenica",
          label: "Calcificação Esplênica",
          alteredText: "Baço com dimensões conservadas, morfologia habitual e ecotextura homogênea exceto por foco de calcificação de aspecto residual.",
          conclusionText: "Calcificação esplênica residual, provavelmente benigna."
        }
      ]
    },
    {
      name: "Rins",
      defaultNormalText: "Rins com dimensões normais, contornos regulares, ecotextura preservada, relação cortico-medular mantida, sem dilatação do sistema coletor ou cálculos.",
      findings: [
        {
          id: "rins-normal",
          label: "Normal",
          alteredText: "Rins com dimensões normais, contornos regulares, ecotextura preservada, relação cortico-medular mantida, sem dilatação do sistema coletor ou cálculos.",
          conclusionText: "Rins sem alterações."
        },
        {
          id: "cisto-renal",
          label: "Cisto Renal Simples",
          requiresSize: true,
          hasLaterality: true,
          hasQuantity: true,
          alteredText: "Nota-se formação cística de paredes finas e conteúdo anecóico, cortical. Cisto renal simples.",
          conclusionText: "Cisto renal simples. Geralmente benigno, sem necessidade de acompanhamento."
        },
        {
          id: "calculo-renal",
          label: "Cálculo Renal (Nefrolitíase)",
          requiresSize: true,
          hasLaterality: true,
          hasQuantity: true,
          alteredText: "Cálculo não obstrutivo localizado em grupamento calicinal. Nefrolitíase.",
          conclusionText: "Nefrolitíase. Sugere-se avaliação urológica para conduta adequada."
        },
        {
          id: "ectasia-pielocalicial",
          label: "Ectasia Pielocalicial",
          hasLaterality: true,
          alteredText: "Pequena dilatação pielocalicinal, sem a caracterização de fator obstrutivo. Ureter distal de calibre preservado.",
          conclusionText: "Ectasia pielocalicial. Correlacionar com dados clínicos."
        },
        {
          id: "nefropatia-cronica",
          label: "Nefropatia Parenquimatosa Crônica",
          hasLaterality: true,
          alteredText: "Rins apresentam dimensões reduzidas, contornos levemente irregulares e topografia normal. Nota-se adelgaçamento e hiperecogenicidade de suas corticais.",
          conclusionText: "Sinais ultrassonográficos de nefropatia parenquimatosa crônica."
        },
        {
          id: "pielonefrite",
          label: "Pielonefrite",
          hasLaterality: true,
          requiresSize: true,
          alteredText: "Presença de hipoecogenicidade focal da cortical, parcialmente delimitada, podendo corresponder a processo inflamatório focal.",
          conclusionText: "Sinais sugestivos de pielonefrite focal. Correlacionar com dados clínicos."
        },
        {
          id: "rim-pelvico",
          label: "Rim Pélvico",
          hasLaterality: true,
          alteredText: "Rim com dimensões, forma, contornos normais, de topografia pélvica.",
          conclusionText: "Rim ectópico em topografia pélvica, variação anatômica."
        }
      ]
    },
    {
      name: "Bexiga",
      defaultNormalText: "Bexiga com paredes finas e conteúdo anecóico, sem alterações.",
      findings: [
        {
          id: "bexiga-normal",
          label: "Normal",
          alteredText: "Bexiga com paredes finas e conteúdo anecóico, sem alterações.",
          conclusionText: "Bexiga sem alterações."
        },
        {
          id: "calculo-bexiga",
          label: "Cálculo na Bexiga",
          requiresSize: true,
          hasQuantity: true,
          alteredText: "Presença de cálculo na bexiga.",
          conclusionText: "Cálculo vesical."
        },
        {
          id: "espessamento-bexiga",
          label: "Espessamento Parietal",
          alteredText: "Espessamento parietal da bexiga.",
          conclusionText: "Espessamento vesical. Correlacionar com dados clínicos."
        }
      ]
    }
  ],

  // ========================================
  // ULTRASSOM GERAL - PELVE FEMININA
  // ========================================
  "US Pelve Feminina": [
    {
      name: "Útero",
      defaultNormalText: "Útero em anteversoflexão/retroversoflexão, com dimensões, contornos e ecotextura miometrial normais.",
      findings: [
        {
          id: "utero-normal",
          label: "Normal",
          alteredText: "Útero em anteversoflexão, com dimensões, contornos e ecotextura miometrial normais.",
          conclusionText: "Útero sem alterações."
        },
        {
          id: "mioma-uterino",
          label: "Mioma Uterino",
          requiresSize: true,
          hasQuantity: true,
          hasCharacteristics: ["Intramural", "Subseroso", "Submucoso", "Pediculado"],
          alteredText: "A ecotextura miometrial é heterogênea à custa de nódulo(s) hipoecogênico(s), bem definido(s).",
          conclusionText: "Mioma(s) uterino(s). Acompanhamento ginecológico. Conduta dependerá do tamanho, sintomas e desejo gestacional.",
          observations: "Localização: parede anterior/posterior/lateral/fúndica"
        },
        {
          id: "adenomiose",
          label: "Adenomiose",
          alteredText: "Útero globoso com espessamento miometrial difuso, apresentando áreas hipoecogênicas e estrias ecogênicas de permeio, caracterizando adenomiose.",
          conclusionText: "Sinais ultrassonográficos de adenomiose."
        }
      ]
    },
    {
      name: "Endométrio",
      defaultNormalText: "Endométrio centrado, com espessura adequada para a fase do ciclo menstrual.",
      findings: [
        {
          id: "endometrio-normal",
          label: "Normal",
          requiresSize: true,
          alteredText: "Endométrio centrado, com espessura adequada para a fase do ciclo menstrual.",
          conclusionText: "Endométrio sem alterações.",
          observations: "Fase proliferativa: 4-8mm, Fase secretora: 7-14mm, Pós-menopausa: <5mm"
        },
        {
          id: "polipo-endometrial",
          label: "Pólipo Endometrial",
          requiresSize: true,
          alteredText: "Endométrio apresentando nódulo hiperecogênico, circunscrito, com pedículo vascular ao Doppler, sugestivo de pólipo endometrial.",
          conclusionText: "Pólipo endometrial. Recomenda-se avaliação ginecológica."
        },
        {
          id: "hiperplasia-endometrial",
          label: "Hiperplasia Endometrial",
          requiresSize: true,
          alteredText: "Endométrio com espessura aumentada para a fase do ciclo ou estado hormonal.",
          conclusionText: "Espessamento endometrial. Recomenda-se avaliação ginecológica para investigação complementar."
        }
      ]
    },
    {
      name: "Ovários",
      defaultNormalText: "Ovários tópicos com dimensões e ecotextura normais, apresentando folículos compatíveis com a fase do ciclo.",
      findings: [
        {
          id: "ovarios-normal",
          label: "Normal",
          alteredText: "Ovários tópicos com dimensões e ecotextura normais, apresentando folículos compatíveis com a fase do ciclo.",
          conclusionText: "Ovários sem alterações."
        },
        {
          id: "cisto-ovariano-simples",
          label: "Cisto Ovariano Simples/Funcional",
          requiresSize: true,
          hasLaterality: true,
          alteredText: "Cisto de paredes finas e conteúdo homogêneo, de aspecto funcional (folicular).",
          conclusionText: "Cisto ovariano de aspecto funcional. Acompanhamento ginecológico. A maioria é funcional e regride espontaneamente."
        },
        {
          id: "cisto-hemorragico",
          label: "Cisto Hemorrágico",
          requiresSize: true,
          hasLaterality: true,
          alteredText: "Cisto de paredes regulares, conteúdo espesso com debris e traves ecogênicas de permeio, sugestivo de cisto de conteúdo hemorrágico.",
          conclusionText: "Cisto ovariano de aspecto hemorrágico. Acompanhamento ginecológico."
        },
        {
          id: "cisto-corpo-luteo",
          label: "Cisto de Corpo Lúteo",
          requiresSize: true,
          hasLaterality: true,
          alteredText: "Cisto de paredes espessas e anfractuosas, apresentando conteúdo hipoecogênico, sugestivo de cisto de corpo lúteo.",
          conclusionText: "Cisto de corpo lúteo. Achado fisiológico."
        },
        {
          id: "endometrioma",
          label: "Endometrioma",
          requiresSize: true,
          hasLaterality: true,
          alteredText: "Cisto com conteúdo ecogênico homogêneo (vidro fosco), sugestivo de endometrioma.",
          conclusionText: "Achado sugestivo de endometrioma. Correlacionar com dados clínicos."
        }
      ]
    },
    {
      name: "Colo Uterino",
      defaultNormalText: "Colo uterino de aspecto habitual, com orifício interno fechado.",
      findings: [
        {
          id: "colo-normal",
          label: "Normal",
          alteredText: "Colo uterino de aspecto habitual, com orifício interno fechado.",
          conclusionText: "Colo uterino sem alterações."
        },
        {
          id: "cistos-naboth",
          label: "Cistos de Naboth",
          alteredText: "O colo uterino e o canal cervical de aspecto habitual, apresentando cistos de retenção subcentimétricos.",
          conclusionText: "Cistos de Naboth (retenção). Achado benigno."
        }
      ]
    },
    {
      name: "DIU",
      defaultNormalText: "Não há DIU no interior da cavidade uterina.",
      findings: [
        {
          id: "diu-topico",
          label: "DIU Tópico",
          alteredText: "Adequado posicionamento de dispositivo endoceptivo na cavidade uterina com extremidade superior distando adequadamente da serosa fúndica e extremidade inferior acima do orifício interno do colo uterino.",
          conclusionText: "DIU tópico e bem posicionado."
        },
        {
          id: "diu-mal-posicionado",
          label: "DIU Mal Posicionado",
          alteredText: "Dispositivo intrauterino com extremidade superior muito próxima ao fundo uterino ou extremidade inferior baixa.",
          conclusionText: "DIU com posicionamento inadequado. Recomenda-se avaliação ginecológica."
        }
      ]
    }
  ],

  // ========================================
  // ULTRASSOM OBSTÉTRICO
  // ========================================
  "US Obstétrico - 1º Trimestre": [
    {
      name: "Gestação",
      defaultNormalText: "Gestação tópica viável.",
      findings: [
        {
          id: "gestacao-inicial",
          label: "Gestação Inicial (sem embrião visível)",
          requiresSize: true,
          alteredText: "Útero gravídico, contendo saco gestacional de paredes regulares e implantação tópica, ainda sem evidência de eco embrionário.",
          conclusionText: "Gestação inicial. Sugere-se controle ultrassonográfico em 10-14 dias."
        },
        {
          id: "gestacao-viavel",
          label: "Gestação Tópica Viável",
          requiresSize: true,
          alteredText: "Gestação tópica, com embrião único, vivo, com atividade cardíaca presente.",
          conclusionText: "Gestação tópica única e viável."
        },
        {
          id: "gestacao-anembrionada",
          label: "Gestação Anembrionada (Blighted Ovum)",
          requiresSize: true,
          alteredText: "Formação cística na cavidade uterina com reação decidual marginal, sugestiva de saco gestacional. Não se observa embrião ou vesícula vitelínica.",
          conclusionText: "Gestação anembrionada. Correlacionar com Beta-HCG quantitativo e, a critério clínico, reavaliar por ultrassonografia."
        },
        {
          id: "morte-embrionaria",
          label: "Morte Embrionária",
          requiresSize: true,
          alteredText: "Embrião sem batimentos cardíacos e sem movimentos corporais.",
          conclusionText: "Gestação inviável. Morte embrionária."
        },
        {
          id: "aborto-retido",
          label: "Aborto Retido",
          alteredText: "Saco gestacional de contornos levemente irregulares, com implantação tópica, contendo embrião sem batimentos cardíacos.",
          conclusionText: "Gestação interrompida (aborto retido)."
        },
        {
          id: "descolamento-ovular",
          label: "Descolamento Ovular",
          requiresSize: true,
          alteredText: "Presença de coleção hipoecogênica adjacente ao contorno do saco gestacional.",
          conclusionText: "Descolamento ovular. Repouso e acompanhamento médico."
        },
        {
          id: "gestacao-gemelar",
          label: "Gestação Gemelar",
          alteredText: "Gestação gemelar bicoriônica biamniótica com embriões vivos.",
          conclusionText: "Gestação gemelar viável."
        },
        {
          id: "gestacao-ectopica",
          label: "Gestação Ectópica",
          alteredText: "Não se observa saco gestacional no interior da cavidade uterina. Presença de massa anexial complexa.",
          conclusionText: "Achados sugestivos de gestação ectópica. Correlacionar com Beta-HCG e avaliação clínica urgente."
        }
      ]
    }
  ],

  "US Obstétrico - 2º/3º Trimestre": [
    {
      name: "Biometria Fetal",
      defaultNormalText: "Biometria fetal compatível com idade gestacional estimada.",
      findings: [
        {
          id: "biometria-adequada",
          label: "Biometria Adequada",
          alteredText: "Parâmetros biométricos adequados para a idade gestacional.",
          conclusionText: "Biometria fetal adequada para idade gestacional."
        },
        {
          id: "rciu",
          label: "Restrição de Crescimento (RCIU)",
          alteredText: "Sinais de restrição do crescimento com peso no percentil < 10.",
          conclusionText: "Restrição de crescimento intrauterino (RCIU). Acompanhamento especializado e Doppler."
        },
        {
          id: "macrossomia",
          label: "Macrossomia Fetal",
          alteredText: "Peso fetal estimado acima do percentil 90 para idade gestacional.",
          conclusionText: "Macrossomia fetal. Correlacionar com diabetes gestacional."
        }
      ]
    },
    {
      name: "Placenta",
      defaultNormalText: "Placenta de inserção tópica, grau adequado para idade gestacional.",
      findings: [
        {
          id: "placenta-normal",
          label: "Placenta Tópica",
          alteredText: "Placenta com inserção anterior/posterior/fúndica, grau de Grannum adequado, espessura normal.",
          conclusionText: "Placenta tópica sem alterações."
        },
        {
          id: "placenta-previa",
          label: "Placenta Prévia",
          alteredText: "Placenta com inserção baixa, insinuando-se no segmento inferior do útero, margeando/recobrindo o óstio cervical interno.",
          conclusionText: "Placenta prévia marginal/total. Controle evolutivo e via de parto cesariana."
        },
        {
          id: "descolamento-placentario",
          label: "Descolamento Prematuro de Placenta (DPP)",
          requiresSize: true,
          alteredText: "Observa-se hematoma heterogêneo intraplacentário ou retroplacentário.",
          conclusionText: "Descolamento prematuro de placenta. Emergência obstétrica."
        }
      ]
    },
    {
      name: "Líquido Amniótico",
      defaultNormalText: "Volume de líquido amniótico normal.",
      findings: [
        {
          id: "la-normal",
          label: "Volume Normal",
          alteredText: "Volume de líquido amniótico normal. ILA (Índice de Líquido Amniótico) adequado.",
          conclusionText: "Volume de líquido amniótico normal."
        },
        {
          id: "oligoidramnio",
          label: "Oligoidrâmnio",
          alteredText: "Volume de líquido amniótico reduzido. ILA < 5 cm.",
          conclusionText: "Oligoidrâmnio. Acompanhamento especializado."
        },
        {
          id: "polidramnio",
          label: "Polidrâmnio",
          alteredText: "Volume de líquido amniótico aumentado. ILA > 25 cm.",
          conclusionText: "Polidrâmnio. Investigar causas (diabetes, malformações)."
        }
      ]
    },
    {
      name: "Colo Uterino",
      defaultNormalText: "Colo uterino com comprimento adequado, orifício interno fechado.",
      findings: [
        {
          id: "colo-gestante-normal",
          label: "Colo Normal",
          requiresSize: true,
          alteredText: "Colo uterino com comprimento adequado (> 25mm), orifício interno fechado.",
          conclusionText: "Colo uterino sem alterações."
        },
        {
          id: "colo-curto",
          label: "Colo Curto (< 25mm)",
          requiresSize: true,
          alteredText: "Colo uterino com comprimento reduzido (menor que 25mm).",
          conclusionText: "Colo uterino curto. Risco aumentado para parto prematuro. Acompanhamento especializado."
        },
        {
          id: "oi-aberto",
          label: "Orifício Interno Aberto",
          alteredText: "Canal endocervical virtual, porém observa-se abertura do orifício cervical interno.",
          conclusionText: "Orifício interno aberto. Risco de incompetência istmo-cervical."
        }
      ]
    },
    {
      name: "Morfologia Fetal",
      defaultNormalText: "Morfologia fetal sem alterações aparentes ao método.",
      findings: [
        {
          id: "morfologia-normal",
          label: "Normal",
          alteredText: "Morfologia fetal sem alterações aparentes ao método.",
          conclusionText: "Morfologia fetal normal."
        },
        {
          id: "hernia-diafragmatica",
          label: "Hérnia Diafragmática",
          alteredText: "Observa-se conteúdo abdominal no tórax fetal, sugestivo de hérnia diafragmática.",
          conclusionText: "Achado sugestivo de hérnia diafragmática. Encaminhar para medicina fetal."
        },
        {
          id: "espinha-bifida",
          label: "Espinha Bífida",
          alteredText: "Observa-se defeito de fechamento da coluna vertebral, sugestivo de espinha bífida.",
          conclusionText: "Achado sugestivo de espinha bífida. Encaminhar para medicina fetal."
        },
        {
          id: "pe-torto",
          label: "Pé Torto",
          alteredText: "Observa-se deformidade do(s) pé(s) fetal(is).",
          conclusionText: "Achado de pé torto. Avaliação ortopédica após nascimento."
        },
        {
          id: "gastrosquise",
          label: "Gastrosquise",
          alteredText: "Observa-se evisceração de alças intestinais através de defeito da parede abdominal.",
          conclusionText: "Achado compatível com gastrosquise. Encaminhar para medicina fetal e cirurgia pediátrica."
        }
      ]
    }
  ]
};

export default EXPANDED_EXAM_DEFINITIONS;
