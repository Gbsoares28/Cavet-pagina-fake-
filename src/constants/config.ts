/**
 * CAVET — Hospital Veterinário Tijuca 24h
 * Configuração oficial da aplicação de avaliação
 */

export const GOOGLE_REVIEW_URL =
  "https://search.google.com/local/writereview?placeid=ChIJ33yZJFalpiER80a5z8iQuPs";

export const COMPANY_INFO = {
  name: "CAVET — Hospital Veterinário Tijuca 24h",
  tradeName: "CAVET Hospital Veterinário",
  unit: "Unidade Tijuca",
  city: "Rio de Janeiro, RJ",
  address: "Rua Conde de Bonfim, 1157 - Tijuca, Rio de Janeiro - RJ, 20530-001",
  emergencyPhone: "(21) 2568-1234",
  whatsapp: "(21) 99876-5432",
  hours: "Atendimento 24 horas ininterrupto",
  specialties: "Emergência 24h • UTI Veterinária • Cirurgias • Exames Laboratoriais e Imagem",
};

export interface RatingOption {
  value: number;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  accentBg: string;
}

export const RATING_OPTIONS: Record<number, RatingOption> = {
  1: {
    value: 1,
    label: "Muito ruim",
    shortLabel: "Muito ruim",
    description: "Lamentamos que sua experiência não tenha sido positiva. Seu relato é fundamental para corrigirmos qualquer falha.",
    color: "#dc2626", // red-600
    accentBg: "bg-red-50 text-red-700 border-red-200",
  },
  2: {
    value: 2,
    label: "Ruim",
    shortLabel: "Ruim",
    description: "Sentimos muito. Gostaríamos de entender o que faltou para que possamos aperfeiçoar nossos serviços.",
    color: "#ea580c", // orange-600
    accentBg: "bg-orange-50 text-orange-700 border-orange-200",
  },
  3: {
    value: 3,
    label: "Regular",
    shortLabel: "Regular",
    description: "Agradecemos sua visita. Queremos elevar nosso padrão para proporcionar o melhor cuidado ao seu pet.",
    color: "#d97706", // amber-600
    accentBg: "bg-amber-50 text-amber-700 border-amber-200",
  },
  4: {
    value: 4,
    label: "Boa",
    shortLabel: "Boa",
    description: "Ficamos contentes com sua avaliação positiva! Trabalhamos com carinho e dedicação contínua.",
    color: "#16a34a", // green-600
    accentBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  5: {
    value: 5,
    label: "Excelente",
    shortLabel: "Excelente",
    description: "Que maravilhoso! Cuidar da saúde e bem-estar do seu pet é nossa maior paixão. Muito obrigado!",
    color: "#0b4c8c", // CAVET primary blue
    accentBg: "bg-blue-50 text-blue-700 border-blue-200",
  },
};

export const QUICK_TOPICS = [
  "Atendimento na recepção",
  "Atenção da equipe veterinária",
  "Pontualidade e agilidade",
  "Cuidado com o pet",
  "Estrutura e limpeza",
  "Emergência 24h",
  "Clareza nas orientações",
];
