/**
 * Knowledge Base: Compêndio da Radiologia
 * Source: https://sites.google.com/site/compendiodaradiologia/
 * 
 * Estrutura hierárquica completa de laudos ultrassonográficos
 */

export interface Finding {
  id: string;
  label: string;
  description: string;
  requiresSize?: boolean;
  hasLaterality?: boolean;
  hasQuantity?: boolean;
  hasCharacteristics?: string[]; // ecogênico, heterogêneo, hiperecogênico, etc
  alteredText: string;
  conclusionText?: string;
  observations?: string;
  measurements?: {
    name: string;
    unit: string;
    normalRange?: string;
  }[];
}

export interface Organ {
  id: string;
  name: string;
  defaultNormalText: string;
  findings: Finding[];
}

export interface Region {
  id: string;
  name: string;
  technique: string;
  organs: Organ[];
}

export interface ExamCategory {
  id: string;
  name: string;
  regions: Region[];
}

/**
 * BASE DE CONHECIMENTO COMPLETA
 */
export const KNOWLEDGE_BASE: ExamCategory[] = [
  // ========================================
  // ULTRASSOM GERAL
  // ========================================
  {
    id: "us-geral",
    name: "Ultrassom Geral",
    regions: [
      // CERVICAL
      {
        id: "cervical",
        name: "Cervical",
        technique: "Exame realizado com transdutor linear de alta frequência na modalidade bidimensional e modo Doppler colorido.",
        organs: [
          {
            id: "tireoide",
            name: "Tireoide",
            defaultNormalText: "Tireoide com dimensões normais, contornos regulares, ecotextura homogênea e simétrica, sem nódulos, cistos ou sinais de inflamação.",
            findings: [
              {
                id: "tireoide-normal",
                label: "Normal",
                description: "Tireoide com dimensões normais, contornos regulares, ecotextura homogênea",
                alteredText: "Tireoide com dimensões normais, contornos regulares, ecotextura homogênea e simétrica, sem nódulos, cistos ou sinais de inflamação.",
                conclusionText: "Tireoide sem alterações."
              },
              {
                id: "tireoidite-autoimune",
                label: "Tireoidite Autoimune (Hashimoto)",
                description: "Parênquima heterogêneo com infiltrado linfocítico e hipervascularização",
                alteredText: "Parênquima apresenta textura heterogênea, observando-se áreas de menor ecogenicidade de permeio de limites mal definidos (podendo traduzir áreas de infiltrado linfocítico). Ao mapeamento dúplex-Doppler colorido, observa-se vascularização difusamente aumentada. As artérias tireoideanas apresentam velocidades de pico sistólico normais.",
                conclusionText: "Alteração textural tireoidiana difusa e hipervascularização ao mapeamento colorido. Este padrão é compatível com tireoidite autoimune."
              },
              {
                id: "nodulo-tireoidiano",
                label: "Nódulo Tireoidiano",
                description: "Nódulo tireoidiano",
                requiresSize: true,
                hasLaterality: true,
                hasQuantity: true,
                hasCharacteristics: ["Hipoecogênico", "Isoecogênico", "Hiperecogênico", "Heterogêneo", "Misto", "Circunscrito", "Irregular", "Com halo", "Sem halo", "Com microcalcificações", "Sem microcalcificações"],
                alteredText: "Nódulo tireoidiano, circunscrito, sem halo hipoecóico ou calcificações, localizado no terço [localização] do lobo tireoidiano [lado].",
                conclusionText: "Nódulo tireoidiano. Sugere-se avaliação endocrinológica e, se necessário, punção aspirativa por agulha fina (PAAF).",
                measurements: [
                  { name: "Diâmetro AP", unit: "cm" },
                  { name: "Diâmetro Transversal", unit: "cm" },
                  { name: "Diâmetro Longitudinal", unit: "cm" },
                  { name: "Volume", unit: "cm³" }
                ]
              },
              {
                id: "cisto-tireoidiano",
                label: "Cisto Tireoidiano",
                description: "Cisto de conteúdo anecóico",
                requiresSize: true,
                hasLaterality: true,
                hasQuantity: true,
                alteredText: "Cisto tireoidiano de paredes finas e conteúdo anecóico.",
                conclusionText: "Cisto tireoidiano. Geralmente benigno, acompanhamento conforme critério clínico."
              },
              {
                id: "hipotireoidismo",
                label: "Hipotireoidismo",
                description: "Tireoide de dimensões reduzidas com ecogenicidade reduzida",
                alteredText: "Tireoide de dimensões reduzidas e contornos regulares. Parênquima com ecogenicidade reduzida e difusamente heterogêneo sem a caracterização de lesões focais definidas.",
                conclusionText: "Os aspectos descritos são compatíveis com diagnóstico clínico proposto de tireoidite."
              }
            ]
          },
          {
            id: "glandulas-submandibulares",
            name: "Glândulas Submandibulares",
            defaultNormalText: "Glândulas submandibulares com dimensões, contornos e ecotextura normais.",
            findings: [
              {
                id: "submandibulares-normal",
                label: "Normal",
                description: "Glândulas submandibulares normais",
                alteredText: "Glândulas submandibulares com dimensões, contornos e ecotextura normais.",
                conclusionText: "Glândulas submandibulares sem alterações."
              },
              {
                id: "sialoadenite",
                label: "Sialoadenite",
                description: "Inflamação das glândulas salivares",
                hasLaterality: true,
                alteredText: "Morfologia globosa, contornos pouco irregulares e dimensões discretamente aumentadas. Ecotextura glandular difusamente heterogênea. Ao mapeamento colorido observa-se vascularização aumentada da glândula submandibular. Ausência de lesões focais no presente estudo.",
                conclusionText: "Sinais ultrassonográficos de sialoadenite submandibular."
              }
            ]
          },
          {
            id: "linfonodos-cervicais",
            name: "Linfonodos Cervicais",
            defaultNormalText: "Linfonodos cervicais de aspecto e dimensões habituais.",
            findings: [
              {
                id: "linfonodos-normal",
                label: "Normal",
                description: "Linfonodos sem alterações",
                alteredText: "Linfonodos cervicais de aspecto e dimensões habituais.",
                conclusionText: "Linfonodos cervicais sem alterações."
              },
              {
                id: "linfondomegalia",
                label: "Linfondomegalia",
                description: "Linfonodos aumentados",
                requiresSize: true,
                hasQuantity: true,
                alteredText: "Observam-se múltiplos linfonodos submandibulares e cervicais posteriores bilaterais, e júgulo-carotídeos, com aspecto hipoecóico e dimensões aumentadas.",
                conclusionText: "Linfondomegalia cervical. Correlacionar com dados clínicos."
              }
            ]
          },
          {
            id: "parotidas",
            name: "Glândulas Parótidas",
            defaultNormalText: "Glândulas parótidas com forma, contornos, topografia e dimensões normais.",
            findings: [
              {
                id: "parotidas-normal",
                label: "Normal",
                description: "Glândulas parótidas normais",
                alteredText: "Glândulas parótidas com forma, contornos, topografia e dimensões normais.",
                conclusionText: "Glândulas parótidas sem alterações."
              },
              {
                id: "parotidite",
                label: "Parotidite",
                description: "Inflamação das parótidas",
                hasLaterality: true,
                alteredText: "Glândulas parótidas têm forma, contornos e topografia normais, notando-se aumento das dimensões da parótida [lado], que apresenta fina alteração exotextural.",
                conclusionText: "Sinais sugestivos de parotidite."
              }
            ]
          }
        ]
      },
      // ABDOME
      {
        id: "abdome",
        name: "Abdome",
        technique: "Exame realizado com transdutor convexo multifrequencial na modalidade bidimensional, com análise da região abdominal superior e inferior.",
        organs: [
          {
            id: "figado",
            name: "Fígado",
            defaultNormalText: "Fígado com dimensões normais, contornos regulares e ecotextura dentro dos padrões habituais. Veias hepáticas e ramos portais preservados. Veia porta de calibre normal (até 1,2 cm).",
            findings: [
              {
                id: "figado-normal",
                label: "Normal",
                description: "Fígado sem alterações",
                alteredText: "Fígado com dimensões normais, contornos regulares e ecotextura dentro dos padrões habituais. Veias hepáticas e ramos portais preservados. Veia porta de calibre normal (até 1,2 cm).",
                conclusionText: "Fígado sem alterações."
              },
              {
                id: "esteatose-hepatica",
                label: "Esteatose Hepática",
                description: "Infiltração gordurosa do fígado",
                alteredText: "Fígado de dimensões normais, contornos regulares, apresentando aumento difuso da ecogenicidade do parênquima, com atenuação do feixe acústico posterior, sem a caracterização de lesões focais bem definidas no presente estudo.",
                conclusionText: "Esteatose hepática (infiltração gordurosa). Recomenda-se acompanhamento clínico e controle de fatores de risco.",
                observations: "Grau de esteatose: Leve/Moderado/Acentuado"
              },
              {
                id: "hepatopatia-parenquimatosa",
                label: "Hepatopatia Parenquimatosa",
                description: "Alterações do parênquima hepático",
                alteredText: "Fígado de dimensões normais, contornos serrilhados, bordas rombas e ecotextura discretamente heterogênea. Não são caracterizadas lesões focais bem definidas no presente estudo.",
                conclusionText: "Hepatopatia parenquimatosa. Correlacionar com dados clínicos e laboratoriais."
              },
              {
                id: "cirrose-hepatica",
                label: "Cirrose Hepática",
                description: "Cirrose com sinais morfológicos",
                alteredText: "Fígado de dimensões reduzidas, com sinais de hipertrofia compensatória dos lobos caudado e esquerdo. Apresenta contornos serrilhados e ecotextura difusamente heterogênea, sem a caracterização de lesões focais bem definidas.",
                conclusionText: "Sinais morfológicos de cirrose hepática. Correlacionar com dados clínicos."
              },
              {
                id: "cisto-hepatico",
                label: "Cisto Hepático",
                description: "Cisto simples do fígado",
                requiresSize: true,
                hasQuantity: true,
                alteredText: "Fígado de dimensões normais, contornos regulares e ecotextura dentro dos padrões habituais exceto por cisto de paredes finas e conteúdo anecóico localizado [localização].",
                conclusionText: "Cisto hepático simples. Geralmente benigno, sem necessidade de acompanhamento."
              },
              {
                id: "hemangioma-hepatico",
                label: "Hemangioma",
                description: "Nódulo hiperecogênico sugestivo de hemangioma",
                requiresSize: true,
                hasQuantity: true,
                alteredText: "Fígado de dimensões normais, contornos regulares e ecotextura dentro dos padrões habituais exceto por nódulo hiperecogênico, circunscrito, localizado [localização], considerar a possibilidade de hemangioma.",
                conclusionText: "Nódulo hepático de aspecto sugestivo de hemangioma. Correlacionar com exames complementares se necessário."
              },
              {
                id: "calcificacao-hepatica",
                label: "Calcificação Hepática",
                description: "Calcificação residual",
                requiresSize: true,
                alteredText: "Fígado de dimensões normais, contornos regulares e ecotextura dentro dos padrões habituais exceto por foco de calcificação de aspecto residual localizado [localização].",
                conclusionText: "Calcificação hepática de aspecto residual, provavelmente benigna."
              },
              {
                id: "hipertensao-portal",
                label: "Hipertensão Portal",
                description: "Sinais de hipertensão portal",
                alteredText: "Veia porta de calibre aumentado. Recanalização da veia paraumbilical. Circulação colateral perigástrica e no hilo esplênico.",
                conclusionText: "Sinais ultrassonográficos de hipertensão portal."
              }
            ]
          },
          {
            id: "vesicula-biliar",
            name: "Vesícula Biliar",
            defaultNormalText: "Vesícula biliar normodistendida, de paredes finas, anecóica, sem cálculos ou dilatação de vias biliares.",
            findings: [
              {
                id: "vesicula-normal",
                label: "Normal",
                description: "Vesícula biliar sem alterações",
                alteredText: "Vesícula biliar normodistendida, de paredes finas, anecóica, sem cálculos ou dilatação de vias biliares.",
                conclusionText: "Vesícula biliar sem alterações."
              },
              {
                id: "colelities",
                label: "Colelitíase (Cálculos)",
                description: "Cálculos na vesícula biliar",
                requiresSize: true,
                hasQuantity: true,
                alteredText: "Vesícula biliar normodistendida, de paredes finas, apresentando cálculo(s) móvel(is) em seu interior.",
                conclusionText: "Colelitíase. Recomenda-se avaliação cirúrgica para colecistectomia, se sintomático.",
                observations: "Cálculos móveis à mudança de decúbito"
              },
              {
                id: "bile-tumefacta",
                label: "Bile Tumefacta (Barro Biliar)",
                description: "Sedimento ecogênico na vesícula",
                alteredText: "Vesícula biliar normodistendida, de paredes finas, contendo sedimento ecogênico amorfo depositado em seu interior, sem imagens calculosas.",
                conclusionText: "Bile tumefacta (barro biliar). Acompanhamento clínico."
              },
              {
                id: "polipo-vesicular",
                label: "Pólipo/Colesterolose",
                description: "Formação aderida à parede vesicular",
                requiresSize: true,
                alteredText: "Observa-se imagem nodular hiperecogênica fixa à parede vesicular, devendo corresponder a colesterolose ou a pequeno pólipo.",
                conclusionText: "Pólipo vesicular ou colesterolose. Acompanhamento conforme critério clínico."
              },
              {
                id: "colecistite",
                label: "Colecistite",
                description: "Inflamação da vesícula biliar",
                alteredText: "Vesícula biliar distendida, apresentando paredes espessadas (espessura > 3mm), forma e contornos preservados. Presença de imagens compatíveis com cálculos em seu interior. O conteúdo vesicular apresenta-se anecóico com finos ecos em suspensão. Os aspectos supramencionados devem corresponder a colecistopatia calculosa, com sinais ultrassonográficos de processo inflamatório associado.",
                conclusionText: "Sinais ultrassonográficos de colecistite aguda. Correlacionar com dados clínicos.",
                observations: "Sinal de Murphy ultrassonográfico pode estar presente"
              },
              {
                id: "colecistectomia",
                label: "Pós-Colecistectomia",
                description: "Status pós-operatório",
                alteredText: "Vesícula biliar não caracterizada (status pós-operatório). Há pequena dilatação das vias biliares intra e extra-hepáticas, habitualmente observada no pós-operatório.",
                conclusionText: "Status pós-colecistectomia."
              }
            ]
          },
          {
            id: "pancreas",
            name: "Pâncreas",
            defaultNormalText: "Pâncreas com dimensões normais, contornos definidos e ecotextura homogênea.",
            findings: [
              {
                id: "pancreas-normal",
                label: "Normal",
                description: "Pâncreas sem alterações",
                alteredText: "Pâncreas com dimensões normais, contornos definidos e ecotextura homogênea.",
                conclusionText: "Pâncreas sem alterações."
              },
              {
                id: "pancreas-obscurecido",
                label: "Avaliação Prejudicada (Gás)",
                description: "Avaliação prejudicada por interposição gasosa",
                alteredText: "Avaliação do pâncreas prejudicada devido à interposição gasosa intestinal.",
                conclusionText: "Pâncreas com avaliação parcial devido a gás intestinal."
              }
            ]
          },
          {
            id: "baco",
            name: "Baço",
            defaultNormalText: "Baço com dimensões normais (até 11-12 cm), morfologia habitual e ecotextura homogênea.",
            findings: [
              {
                id: "baco-normal",
                label: "Normal",
                description: "Baço sem alterações",
                alteredText: "Baço com dimensões normais, morfologia habitual e ecotextura homogênea.",
                conclusionText: "Baço sem alterações."
              },
              {
                id: "esplenomegalia",
                label: "Esplenomegalia",
                description: "Aumento do baço",
                requiresSize: true,
                alteredText: "Baço com dimensões aumentadas, morfologia habitual e ecotextura homogênea.",
                conclusionText: "Esplenomegalia. Correlacionar com dados clínicos.",
                measurements: [
                  { name: "Comprimento", unit: "cm", normalRange: "até 11-12 cm" }
                ]
              },
              {
                id: "baco-acessorio",
                label: "Baço Acessório",
                description: "Baço acessório",
                requiresSize: true,
                alteredText: "Baço acessório localizado [localização].",
                conclusionText: "Baço acessório, achado benigno."
              },
              {
                id: "cisto-esplenico",
                label: "Cisto Esplênico",
                description: "Cisto no baço",
                requiresSize: true,
                alteredText: "Baço com dimensões conservadas, morfologia habitual e ecotextura homogênea exceto por cisto de paredes finas e conteúdo anecóico.",
                conclusionText: "Cisto esplênico simples."
              },
              {
                id: "calcificacao-esplenica",
                label: "Calcificação Esplênica",
                description: "Calcificação residual",
                alteredText: "Baço com dimensões conservadas, morfologia habitual e ecotextura homogênea exceto por foco de calcificação de aspecto residual.",
                conclusionText: "Calcificação esplênica residual, provavelmente benigna."
              }
            ]
          },
          {
            id: "rins",
            name: "Rins",
            defaultNormalText: "Rins com dimensões normais, contornos regulares, ecotextura preservada, relação cortico-medular mantida, sem dilatação do sistema coletor ou cálculos.",
            findings: [
              {
                id: "rins-normal",
                label: "Normal",
                description: "Rins sem alterações",
                alteredText: "Rins com dimensões normais, contornos regulares, ecotextura preservada, relação cortico-medular mantida, sem dilatação do sistema coletor ou cálculos.",
                conclusionText: "Rins sem alterações."
              },
              {
                id: "cisto-renal",
                label: "Cisto Renal Simples",
                description: "Cisto renal de aspecto simples",
                requiresSize: true,
                hasLaterality: true,
                hasQuantity: true,
                alteredText: "Nota-se formação cística de paredes finas e conteúdo anecóico, cortical, localizada em seu pólo [superior/inferior/terço médio]. Cisto renal simples.",
                conclusionText: "Cisto renal simples. Geralmente benigno, sem necessidade de acompanhamento."
              },
              {
                id: "calculo-renal",
                label: "Cálculo Renal (Nefrolitíase)",
                description: "Cálculo no rim",
                requiresSize: true,
                hasLaterality: true,
                hasQuantity: true,
                alteredText: "Cálculo não obstrutivo localizado em grupamento calicinal [superior/médio/inferior]. Nefrolitíase.",
                conclusionText: "Nefrolitíase. Sugere-se avaliação urológica para conduta adequada."
              },
              {
                id: "ectasia-pielocalicial",
                label: "Ectasia Pielocalicial",
                description: "Dilatação do sistema coletor",
                hasLaterality: true,
                alteredText: "Pequena dilatação pielocalicinal, sem a caracterização de fator obstrutivo. Ureter distal de calibre preservado.",
                conclusionText: "Ectasia pielocalicial. Correlacionar com dados clínicos."
              },
              {
                id: "nefropatia-cronica",
                label: "Nefropatia Parenquimatosa Crônica",
                description: "Rins diminuídos com alterações crônicas",
                hasLaterality: true,
                alteredText: "Rins apresentam dimensões reduzidas, contornos levemente irregulares e topografia normal. Nota-se adelgaçamento e hiperecogenicidade de suas corticais.",
                conclusionText: "Sinais ultrassonográficos de nefropatia parenquimatosa crônica."
              },
              {
                id: "pielonefrite",
                label: "Pielonefrite",
                description: "Inflamação renal focal",
                hasLaterality: true,
                requiresSize: true,
                alteredText: "Presença de hipoecogenicidade focal da cortical, parcialmente delimitada, podendo corresponder a processo inflamatório focal.",
                conclusionText: "Sinais sugestivos de pielonefrite focal. Correlacionar com dados clínicos."
              },
              {
                id: "rim-pelvico",
                label: "Rim Pélvico",
                description: "Rim em topografia pélvica",
                hasLaterality: true,
                alteredText: "Rim com dimensões, forma, contornos normais, de topografia pélvica.",
                conclusionText: "Rim ectópico em topografia pélvica, variação anatômica."
              }
            ]
          }
        ]
      },
      // PELVE FEMININA
      {
        id: "pelve-feminina",
        name: "Pelve Feminina",
        technique: "Exame realizado com transdutor convexo e endocavitário multifrequencial nas modalidades bidimensional e Doppler colorido.",
        organs: [
          {
            id: "utero",
            name: "Útero",
            defaultNormalText: "Útero em anteversoflexão, com dimensões, contornos e ecotextura miometrial normais.",
            findings: [
              {
                id: "utero-normal",
                label: "Normal",
                description: "Útero sem alterações",
                alteredText: "Útero em anteversoflexão/retroversoflexão, com dimensões, contornos e ecotextura miometrial normais.",
                conclusionText: "Útero sem alterações.",
                measurements: [
                  { name: "Comprimento", unit: "cm", normalRange: "7-8 cm" },
                  { name: "Largura", unit: "cm", normalRange: "4-5 cm" },
                  { name: "Anteroposterior", unit: "cm", normalRange: "3-4 cm" }
                ]
              },
              {
                id: "mioma-uterino",
                label: "Mioma Uterino",
                description: "Nódulo miomatoso no útero",
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
                description: "Espessamento miometrial difuso",
                alteredText: "Útero globoso com espessamento miometrial difuso, apresentando áreas hipoecogênicas e estrias ecogênicas de permeio, caracterizando adenomiose.",
                conclusionText: "Sinais ultrassonográficos de adenomiose."
              }
            ]
          },
          {
            id: "endometrio",
            name: "Endométrio",
            defaultNormalText: "Endométrio centrado, com espessura adequada para a fase do ciclo menstrual.",
            findings: [
              {
                id: "endometrio-normal",
                label: "Normal",
                description: "Endométrio sem alterações",
                requiresSize: true,
                alteredText: "Endométrio centrado, com espessura adequada para a fase do ciclo menstrual.",
                conclusionText: "Endométrio sem alterações.",
                observations: "Fase proliferativa: 4-8mm, Fase secretora: 7-14mm, Pós-menopausa: <5mm",
                measurements: [
                  { name: "Espessura", unit: "mm", normalRange: "variável conforme fase" }
                ]
              },
              {
                id: "polipo-endometrial",
                label: "Pólipo Endometrial",
                description: "Nódulo endometrial com pedículo vascular",
                requiresSize: true,
                alteredText: "Endométrio apresentando nódulo hiperecogênico, circunscrito, com pedículo vascular ao Doppler, sugestivo de pólipo endometrial.",
                conclusionText: "Pólipo endometrial. Recomenda-se avaliação ginecológica."
              },
              {
                id: "hiperplasia-endometrial",
                label: "Hiperplasia Endometrial",
                description: "Espessamento endometrial",
                requiresSize: true,
                alteredText: "Endométrio com espessura aumentada para a fase do ciclo ou estado hormonal.",
                conclusionText: "Espessamento endometrial. Recomenda-se avaliação ginecológica para investigação complementar."
              }
            ]
          },
          {
            id: "ovarios",
            name: "Ovários",
            defaultNormalText: "Ovários tópicos com dimensões e ecotextura normais, apresentando folículos compatíveis com a fase do ciclo.",
            findings: [
              {
                id: "ovarios-normal",
                label: "Normal",
                description: "Ovários sem alterações",
                alteredText: "Ovários tópicos com dimensões e ecotextura normais, apresentando folículos compatíveis com a fase do ciclo.",
                conclusionText: "Ovários sem alterações.",
                measurements: [
                  { name: "Volume", unit: "cm³", normalRange: "3-10 cm³" }
                ]
              },
              {
                id: "cisto-ovariano-simples",
                label: "Cisto Ovariano Simples/Funcional",
                description: "Cisto de aspecto funcional",
                requiresSize: true,
                hasLaterality: true,
                alteredText: "Cisto de paredes finas e conteúdo homogêneo, de aspecto funcional (folicular).",
                conclusionText: "Cisto ovariano de aspecto funcional. Acompanhamento ginecológico. A maioria é funcional e regride espontaneamente."
              },
              {
                id: "cisto-hemorragico",
                label: "Cisto Hemorrágico",
                description: "Cisto com conteúdo hemorrágico",
                requiresSize: true,
                hasLaterality: true,
                alteredText: "Cisto de paredes regulares, conteúdo espesso com debris e traves ecogênicas de permeio, sugestivo de cisto de conteúdo hemorrágico.",
                conclusionText: "Cisto ovariano de aspecto hemorrágico. Acompanhamento ginecológico."
              },
              {
                id: "cisto-corpo-luteo",
                label: "Cisto de Corpo Lúteo",
                description: "Cisto com características de corpo lúteo",
                requiresSize: true,
                hasLaterality: true,
                alteredText: "Cisto de paredes espessas e anfractuosas, apresentando conteúdo hipoecogênico, sugestivo de cisto de corpo lúteo.",
                conclusionText: "Cisto de corpo lúteo. Achado fisiológico."
              },
              {
                id: "endometrioma",
                label: "Endometrioma",
                description: "Cisto endometriótico",
                requiresSize: true,
                hasLaterality: true,
                alteredText: "Cisto com conteúdo ecogênico homogêneo (vidro fosco), sugestivo de endometrioma.",
                conclusionText: "Achado sugestivo de endometrioma. Correlacionar com dados clínicos."
              }
            ]
          },
          {
            id: "colo-uterino",
            name: "Colo Uterino",
            defaultNormalText: "Colo uterino de aspecto habitual, com orifício interno fechado.",
            findings: [
              {
                id: "colo-normal",
                label: "Normal",
                description: "Colo uterino sem alterações",
                alteredText: "Colo uterino de aspecto habitual, com orifício interno fechado.",
                conclusionText: "Colo uterino sem alterações."
              },
              {
                id: "cistos-naboth",
                label: "Cistos de Naboth",
                description: "Cistos de retenção no colo",
                alteredText: "O colo uterino e o canal cervical de aspecto habitual, apresentando cistos de retenção subcentimétricos.",
                conclusionText: "Cistos de Naboth (retenção). Achado benigno."
              }
            ]
          },
          {
            id: "diu",
            name: "DIU (Dispositivo Intrauterino)",
            defaultNormalText: "Não há DIU no interior da cavidade uterina.",
            findings: [
              {
                id: "diu-topico",
                label: "DIU Tópico",
                description: "DIU bem posicionado",
                alteredText: "Adequado posicionamento de dispositivo endoceptivo na cavidade uterina com extremidade superior distando [X] cm da serosa fúndica e extremidade inferior acima do orifício interno do colo uterino.",
                conclusionText: "DIU tópico e bem posicionado."
              },
              {
                id: "diu-mal-posicionado",
                label: "DIU Mal Posicionado",
                description: "DIU com posição inadequada",
                alteredText: "Dispositivo intrauterino com extremidade superior muito próxima ao fundo uterino ou extremidade inferior baixa.",
                conclusionText: "DIU com posicionamento inadequado. Recomenda-se avaliação ginecológica."
              }
            ]
          }
        ]
      }
    ]
  },
  // ========================================
  // ULTRASSOM OBSTÉTRICO
  // ========================================
  {
    id: "us-obstetrico",
    name: "Ultrassom Obstétrico",
    regions: [
      {
        id: "gestacao",
        name: "Gestação",
        technique: "Exame realizado com transdutor convexo/endocavitário multifrequencial na modalidade bidimensional e Doppler colorido quando indicado.",
        organs: [
          {
            id: "saco-gestacional",
            name: "Saco Gestacional",
            defaultNormalText: "Saco gestacional tópico, de contornos regulares.",
            findings: [
              {
                id: "gestacao-inicial",
                label: "Gestação Inicial (sem embrião visível)",
                description: "Saco gestacional sem eco embrionário",
                requiresSize: true,
                alteredText: "Útero gravídico, contendo saco gestacional de paredes regulares e implantação tópica, ainda sem evidência de eco embrionário.",
                conclusionText: "Gestação inicial. Sugere-se controle ultrassonográfico em 10-14 dias.",
                measurements: [
                  { name: "Diâmetro Médio do Saco Gestacional (DMSG)", unit: "mm" }
                ]
              },
              {
                id: "gestacao-viavel",
                label: "Gestação Tópica Viável",
                description: "Embrião com batimentos cardíacos",
                requiresSize: true,
                alteredText: "Gestação tópica, com embrião único, vivo, com atividade cardíaca presente.",
                conclusionText: "Gestação tópica única e viável.",
                measurements: [
                  { name: "Comprimento Cabeça-Nádega (CCN)", unit: "mm" },
                  { name: "Frequência Cardíaca Fetal (FCF)", unit: "bpm", normalRange: "110-180 bpm" }
                ]
              },
              {
                id: "gestacao-anembrionada",
                label: "Gestação Anembrionada",
                description: "Saco gestacional sem embrião (Blighted ovum)",
                requiresSize: true,
                alteredText: "Formação cística na cavidade uterina com reação decidual marginal, sugestiva de saco gestacional. Não se observa embrião ou vesícula vitelínica.",
                conclusionText: "Gestação anembrionada. Correlacionar com Beta-HCG quantitativo e, a critério clínico, reavaliar por ultrassonografia."
              },
              {
                id: "morte-embrionaria",
                label: "Morte Embrionária",
                description: "Embrião sem batimentos cardíacos",
                requiresSize: true,
                alteredText: "Embrião sem batimentos cardíacos e sem movimentos corporais, cujo comprimento cabeça-nádega mede [X] mm.",
                conclusionText: "Gestação inviável. Morte embrionária."
              },
              {
                id: "aborto-retido",
                label: "Aborto Retido",
                description: "Gestação interrompida sem expulsão",
                alteredText: "Saco gestacional de contornos levemente irregulares, com implantação tópica, contendo embrião sem batimentos cardíacos.",
                conclusionText: "Gestação interrompida (aborto retido)."
              },
              {
                id: "descolamento-ovular",
                label: "Descolamento Ovular",
                description: "Coleção entre saco gestacional e decídua",
                requiresSize: true,
                alteredText: "Presença de coleção hipoecogênica adjacente ao contorno do saco gestacional.",
                conclusionText: "Descolamento ovular. Repouso e acompanhamento médico."
              }
            ]
          },
          {
            id: "biometria-fetal",
            name: "Biometria Fetal",
            defaultNormalText: "Biometria fetal compatível com idade gestacional estimada.",
            findings: [
              {
                id: "biometria-adequada",
                label: "Biometria Adequada",
                description: "Crescimento fetal adequado",
                alteredText: "Parâmetros biométricos adequados para a idade gestacional.",
                conclusionText: "Biometria fetal adequada para idade gestacional.",
                measurements: [
                  { name: "Diâmetro Biparietal (DBP)", unit: "mm" },
                  { name: "Circunferência Cefálica (CC)", unit: "mm" },
                  { name: "Circunferência Abdominal (CA)", unit: "mm" },
                  { name: "Comprimento do Fêmur (CF)", unit: "mm" },
                  { name: "Peso Fetal Estimado", unit: "gramas" }
                ]
              },
              {
                id: "rciu",
                label: "Restrição de Crescimento (RCIU)",
                description: "Feto pequeno para idade gestacional",
                alteredText: "Sinais de restrição do crescimento com peso no percentil < 10.",
                conclusionText: "Restrição de crescimento intrauterino (RCIU). Acompanhamento especializado e Doppler."
              },
              {
                id: "macrossomia",
                label: "Macrossomia Fetal",
                description: "Feto grande para idade gestacional",
                alteredText: "Peso fetal estimado acima do percentil 90 para idade gestacional.",
                conclusionText: "Macrossomia fetal. Correlacionar com diabetes gestacional."
              }
            ]
          },
          {
            id: "placenta",
            name: "Placenta",
            defaultNormalText: "Placenta de inserção [localização], grau [0-3] de Grannum, espessura normal.",
            findings: [
              {
                id: "placenta-normal",
                label: "Placenta Tópica",
                description: "Placenta com inserção normal",
                alteredText: "Placenta com inserção [anterior/posterior/fúndica/lateral], grau [0-3] de Grannum, espessura de [X] cm.",
                conclusionText: "Placenta tópica sem alterações.",
                measurements: [
                  { name: "Espessura placentária", unit: "cm", normalRange: "2-4 cm" }
                ]
              },
              {
                id: "placenta-previa",
                label: "Placenta Prévia",
                description: "Placenta cobrindo ou próxima ao colo",
                alteredText: "Placenta com inserção [localização], insinuando-se no segmento inferior do útero, [margeando/recobrindo] o óstio cervical interno.",
                conclusionText: "Placenta prévia [marginal/total]. Controle evolutivo e via de parto cesariana."
              },
              {
                id: "descolamento-placentario",
                label: "Descolamento Prematuro de Placenta (DPP)",
                description: "Hematoma retroplacentário",
                requiresSize: true,
                alteredText: "Observa-se hematoma heterogêneo intraplacentário ou retroplacentário, contendo material hiperecogênico (sangue).",
                conclusionText: "Descolamento prematuro de placenta. Emergência obstétrica."
              }
            ]
          },
          {
            id: "liquido-amniotico",
            name: "Líquido Amniótico",
            defaultNormalText: "Volume de líquido amniótico normal.",
            findings: [
              {
                id: "la-normal",
                label: "Volume Normal",
                description: "Líquido amniótico adequado",
                alteredText: "Volume de líquido amniótico normal. ILA (Índice de Líquido Amniótico) = [X] cm / Maior bolsão = [X] cm.",
                conclusionText: "Volume de líquido amniótico normal.",
                measurements: [
                  { name: "ILA", unit: "cm", normalRange: "8-18 cm" },
                  { name: "Maior bolsão", unit: "cm", normalRange: "2-8 cm" }
                ]
              },
              {
                id: "oligoidramnio",
                label: "Oligoidrâmnio",
                description: "Redução do líquido amniótico",
                alteredText: "Volume de líquido amniótico reduzido. ILA < 5 cm.",
                conclusionText: "Oligoidrâmnio. Acompanhamento especializado."
              },
              {
                id: "polidramnio",
                label: "Polidrâmnio",
                description: "Aumento do líquido amniótico",
                alteredText: "Volume de líquido amniótico aumentado. ILA > 25 cm.",
                conclusionText: "Polidrâmnio. Investigar causas (diabetes, malformações)."
              }
            ]
          },
          {
            id: "colo-uterino-gestante",
            name: "Colo Uterino (Via Transvaginal)",
            defaultNormalText: "Colo uterino com comprimento adequado, orifício interno fechado.",
            findings: [
              {
                id: "colo-gestante-normal",
                label: "Colo Normal",
                description: "Colo uterino sem alterações",
                requiresSize: true,
                alteredText: "Colo uterino com comprimento de [X] cm, orifício interno fechado.",
                conclusionText: "Colo uterino sem alterações.",
                measurements: [
                  { name: "Comprimento do colo", unit: "mm", normalRange: "> 25 mm" }
                ]
              },
              {
                id: "colo-curto",
                label: "Colo Curto",
                description: "Colo < 25mm (risco de parto prematuro)",
                requiresSize: true,
                alteredText: "Colo uterino com comprimento de [X] mm (menor que 25mm).",
                conclusionText: "Colo uterino curto. Risco aumentado para parto prematuro. Acompanhamento especializado."
              },
              {
                id: "oi-aberto",
                label: "Orifício Interno Aberto",
                description: "Abertura do orifício interno",
                alteredText: "Canal endocervical virtual, porém observa-se abertura do orifício cervical interno.",
                conclusionText: "Orifício interno aberto. Risco de incompetência istmo-cervical."
              }
            ]
          }
        ]
      }
    ]
  }
];

export default KNOWLEDGE_BASE;
