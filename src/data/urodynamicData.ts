// Types de base
export interface PatientData {
  age: number;
  sexe: 'M' | 'F';
  symptomes: string[];
  antecedents: string[];
  traitements: string[];
  debitMetrie: DebitMetrie;
  cystometrie: Cystometrie;
  profilPression: ProfilPression;
  emg: EMG;
  etudePressionDebit: EtudePressionDebit;
  testsProvocation: TestsProvocation;
  cystometrieRemplissage: CystometrieRemplissage;
  residuPostMictionnel: number;
}

export interface DebitMetrie {
  qMax: number;
  qMoyen: number;
  volumeVide: number;
  tempsVidange: number;
  formeDebitmetrie: 'normale' | 'en_plateau' | 'intermittente' | 'en_cloche';
  tempsLatence: number;
  tempsJusquQmax: number;
}

export interface Cystometrie {
  capaciteVesicale: number;
  pressionDetrusor: number;
  pressionAbdominale: number;
  pressionVesicale: number;
  compliance: number;
  contractions: 'absentes' | 'stables' | 'instables';
  sensibilite: 'normale' | 'diminuee' | 'augmentee';
  premierBesoin: number;
  besoinNormal: number;
  capaciteMaximale: number;
  vitesseRemplissage: number;
  pressionFuite: number;
}

export interface ProfilPression {
  pressionUretrale: number;
  longueurUretrale: number;
  pressionClotureUretrale: number;
  longueurFonctionnelle: number;
  pressionTransmission: number;
  profilDynamique: 'normal' | 'anormal';
}

export interface EMG {
  activiteBasale: 'normale' | 'augmentee' | 'diminuee' | 'absente';
  recrutementVolontaire: 'normal' | 'diminue' | 'absent';
  reflexeSphincter: 'present' | 'absent' | 'retarde';
  synergieDetrusorSphincter: 'normale' | 'dyssynergie' | 'pseudodyssynergie';
  fatigabilite: 'normale' | 'augmentee';
}

export interface EtudePressionDebit {
  pressionDetrusorQmax: number;
  indexObstruction: number;
  indexContractilite: number;
  resistanceUretrale: number;
  conductanceUretrale: number;
}

export interface TestsProvocation {
  testToux: 'negatif' | 'positif_faible' | 'positif_fort';
  testValsalva: 'negatif' | 'positif_faible' | 'positif_fort';
  testStressUretral: number;
  pressionFuiteAbdominale: number;
}

export interface CystometrieRemplissage {
  vitesseLente: {
    compliance: number;
    contractions: 'absentes' | 'presentes';
    sensibilite: 'normale' | 'diminuee' | 'augmentee';
  };
  vitesseRapide: {
    compliance: number;
    contractions: 'absentes' | 'presentes';
    sensibilite: 'normale' | 'diminuee' | 'augmentee';
  };
  vitessePhysiologique: {
    compliance: number;
    contractions: 'absentes' | 'presentes';
    sensibilite: 'normale' | 'diminuee' | 'augmentee';
  };
}

export interface DiagnosticResult {
  diagnostic: string;
  recommandations: string[];
  examensComplementaires: string[];
  traitements: string[];
  surveillance: string[];
  pieges: string[];
  alertesCritiques: string[];
  indexCalcules: Record<string, number>;
  nomogrammes: {
    schafer?: string;
    abramsGriffiths?: string;
  };
  explications: {
    recommandations: string[];
    examensComplementaires: string[];
    traitements: string[];
    surveillance: string[];
    pieges: string[];
  };
  patientData?: PatientData;
}

// Constantes
export const SYMPTOMES = [
  'Pollakiurie diurne',
  'Nycturie',
  'Urgenturies',
  'Incontinence d\'urgence',
  'Incontinence d\'effort',
  'Incontinence mixte',
  'Dysurie',
  'Jet faible',
  'Jet intermittent',
  'Poussée abdominale',
  'Sensation de vidange incomplète',
  'Gouttes retardataires',
  'Rétention urinaire',
  'Douleurs pelviennes',
  'Brûlures mictionnelles',
  'Hématurie'
];

export const ANTECEDENTS = [
  'Diabète',
  'Hypertension artérielle',
  'Maladie neurologique',
  'AVC',
  'Sclérose en plaques',
  'Maladie de Parkinson',
  'Traumatisme médullaire',
  'Chirurgie pelvienne',
  'Chirurgie prostatique',
  'Hystérectomie',
  'Radiothérapie pelvienne',
  'Infections urinaires récidivantes',
  'Lithiase urinaire',
  'Cancer de la prostate',
  'Cancer de la vessie',
  'Prolapsus génital'
];

export const TRAITEMENTS = [
  'Alpha-bloquants',
  'Anticholinergiques',
  'Agonistes β3-adrénergiques',
  'Inhibiteurs 5α-réductase',
  'Antispasmodiques',
  'Œstrogènes locaux',
  'Toxine botulique',
  'Neuromodulation sacrée',
  'Sondage intermittent',
  'Sonde à demeure',
  'Rééducation périnéale',
  'Biofeedback'
];

// Templates d'examens prédéfinis
export const TEMPLATES_EXAMENS = {
  hyperactivite_vesicale: {
    nom: "Hyperactivité vésicale",
    description: "Patient avec urgenturies et pollakiurie",
    defaultValues: {
      symptomes: ['Urgenturies', 'Pollakiurie diurne', 'Nycturie'],
      cystometrie: {
        capaciteVesicale: 250,
        contractions: 'instables' as const,
        premierBesoin: 80,
        besoinNormal: 150
      }
    }
  },
  obstruction_prostatique: {
    nom: "Obstruction prostatique",
    description: "Homme avec dysurie et jet faible",
    defaultValues: {
      sexe: 'M' as const,
      symptomes: ['Dysurie', 'Jet faible', 'Sensation de vidange incomplète'],
      debitMetrie: {
        qMax: 8,
        formeDebitmetrie: 'en_plateau' as const
      },
      etudePressionDebit: {
        pressionDetrusorQmax: 65,
        indexObstruction: 45
      }
    }
  },
  incontinence_effort: {
    nom: "Incontinence d'effort",
    description: "Femme avec fuites à l'effort",
    defaultValues: {
      sexe: 'F' as const,
      symptomes: ['Incontinence d\'effort'],
      testsProvocation: {
        testToux: 'positif_fort' as const,
        pressionFuiteAbdominale: 45
      },
      profilPression: {
        pressionClotureUretrale: 25
      }
    }
  },
  dyssynergie_vesico_sphincterienne: {
    nom: "Dyssynergie vésico-sphinctérienne",
    description: "Patient neurologique avec dyssynergie",
    defaultValues: {
      symptomes: ['Dysurie', 'Sensation de vidange incomplète', 'Rétention urinaire'],
      antecedents: ['Traumatisme médullaire'],
      emg: {
        synergieDetrusorSphincter: 'dyssynergie' as const
      },
      etudePressionDebit: {
        pressionDetrusorQmax: 80,
        indexObstruction: 50
      },
      residuPostMictionnel: 200
    }
  },
  hypocontractilite_detrusorienne: {
    nom: "Hypocontractilité détrusorienne",
    description: "Patient avec faible contractilité du détrusor",
    defaultValues: {
      symptomes: ['Jet faible', 'Sensation de vidange incomplète', 'Poussée abdominale'],
      antecedents: ['Diabète'],
      debitMetrie: {
        qMax: 8,
        formeDebitmetrie: 'en_plateau' as const
      },
      etudePressionDebit: {
        pressionDetrusorQmax: 15,
        indexContractilite: 55
      },
      residuPostMictionnel: 120
    }
  }
};

// Glossaire (version simplifiée - la version complète est dans glossaryData.ts)
export const GLOSSAIRE = {
  "Qmax": {
    definition: "Débit urinaire maximum atteint pendant la miction",
    unite: "ml/s",
    valeursNormales: "Homme: >15 ml/s, Femme: >15 ml/s",
    obtention: "Mesuré par débitmètre libre",
    interpretation: "Qmax <10 ml/s évoque une obstruction"
  },
  "Compliance": {
    definition: "Capacité de la vessie à se distendre",
    unite: "ml/cmH2O",
    valeursNormales: ">20 ml/cmH2O",
    obtention: "ΔVolume / ΔPression",
    interpretation: "Compliance réduite évoque fibrose vésicale"
  }
  // ... autres définitions de base
};

// Cas cliniques de démonstration
export const CAS_CLINIQUES = [
  {
    id: 1,
    titre: "Hyperactivité Vésicale Idiopathique",
    description: "Femme de 65 ans avec urgenturies et pollakiurie diurne",
    donnee: {
      age: 65,
      sexe: 'F' as const,
      symptomes: ['Urgenturies', 'Pollakiurie diurne', 'Nycturie', 'Incontinence d\'urgence'],
      antecedents: ['Hypertension artérielle'],
      traitements: [],
      debitMetrie: {
        qMax: 22,
        qMoyen: 14,
        volumeVide: 280,
        tempsVidange: 25,
        formeDebitmetrie: 'normale' as const,
        tempsLatence: 3,
        tempsJusquQmax: 8
      },
      cystometrie: {
        capaciteVesicale: 220,
        pressionDetrusor: 25,
        pressionAbdominale: 12,
        pressionVesicale: 37,
        compliance: 18,
        contractions: 'instables' as const,
        sensibilite: 'augmentee' as const,
        premierBesoin: 80,
        besoinNormal: 150,
        capaciteMaximale: 220,
        vitesseRemplissage: 50,
        pressionFuite: 0
      },
      profilPression: {
        pressionUretrale: 65,
        longueurUretrale: 35,
        pressionClotureUretrale: 40,
        longueurFonctionnelle: 28,
        pressionTransmission: 85,
        profilDynamique: 'normal' as const
      },
      emg: {
        activiteBasale: 'normale' as const,
        recrutementVolontaire: 'normal' as const,
        reflexeSphincter: 'present' as const,
        synergieDetrusorSphincter: 'normale' as const,
        fatigabilite: 'normale' as const
      },
      etudePressionDebit: {
        pressionDetrusorQmax: 28,
        indexObstruction: -16,
        indexContractilite: 138,
        resistanceUretrale: 1.3,
        conductanceUretrale: 0.79
      },
      testsProvocation: {
        testToux: 'negatif' as const,
        testValsalva: 'negatif' as const,
        testStressUretral: 0,
        pressionFuiteAbdominale: 0
      },
      cystometrieRemplissage: {
        vitesseLente: {
          compliance: 20,
          contractions: 'presentes' as const,
          sensibilite: 'augmentee' as const
        },
        vitesseRapide: {
          compliance: 16,
          contractions: 'presentes' as const,
          sensibilite: 'augmentee' as const
        },
        vitessePhysiologique: {
          compliance: 18,
          contractions: 'presentes' as const,
          sensibilite: 'augmentee' as const
        }
      },
      residuPostMictionnel: 15
    }
  },
  {
    id: 2,
    titre: "Obstruction Prostatique Modérée",
    description: "Homme de 72 ans avec dysurie et jet faible",
    donnee: {
      age: 72,
      sexe: 'M' as const,
      symptomes: ['Dysurie', 'Jet faible', 'Sensation de vidange incomplète', 'Nycturie'],
      antecedents: ['Hypertension artérielle', 'Diabète'],
      traitements: ['Alpha-bloquants'],
      debitMetrie: {
        qMax: 9,
        qMoyen: 6,
        volumeVide: 320,
        tempsVidange: 55,
        formeDebitmetrie: 'en_plateau' as const,
        tempsLatence: 8,
        tempsJusquQmax: 25
      },
      cystometrie: {
        capaciteVesicale: 480,
        pressionDetrusor: 35,
        pressionAbdominale: 18,
        pressionVesicale: 53,
        compliance: 25,
        contractions: 'stables' as const,
        sensibilite: 'normale' as const,
        premierBesoin: 180,
        besoinNormal: 320,
        capaciteMaximale: 480,
        vitesseRemplissage: 50,
        pressionFuite: 0
      },
      profilPression: {
        pressionUretrale: 85,
        longueurUretrale: 22,
        pressionClotureUretrale: 50,
        longueurFonctionnelle: 18,
        pressionTransmission: 90,
        profilDynamique: 'normal' as const
      },
      emg: {
        activiteBasale: 'normale' as const,
        recrutementVolontaire: 'normal' as const,
        reflexeSphincter: 'present' as const,
        synergieDetrusorSphincter: 'normale' as const,
        fatigabilite: 'normale' as const
      },
      etudePressionDebit: {
        pressionDetrusorQmax: 58,
        indexObstruction: 40,
        indexContractilite: 103,
        resistanceUretrale: 6.4,
        conductanceUretrale: 0.16
      },
      testsProvocation: {
        testToux: 'negatif' as const,
        testValsalva: 'negatif' as const,
        testStressUretral: 0,
        pressionFuiteAbdominale: 0
      },
      cystometrieRemplissage: {
        vitesseLente: {
          compliance: 26,
          contractions: 'absentes' as const,
          sensibilite: 'normale' as const
        },
        vitesseRapide: {
          compliance: 24,
          contractions: 'absentes' as const,
          sensibilite: 'normale' as const
        },
        vitessePhysiologique: {
          compliance: 25,
          contractions: 'absentes' as const,
          sensibilite: 'normale' as const
        }
      },
      residuPostMictionnel: 85
    }
  },
  {
    id: 3,
    titre: "Incontinence d'Effort Sévère",
    description: "Femme de 58 ans post-hystérectomie avec incontinence d'effort sévère",
    donnee: {
      age: 58,
      sexe: 'F' as const,
      symptomes: ['Incontinence d\'effort'],
      antecedents: ['Hystérectomie'],
      traitements: [],
      debitMetrie: {
        qMax: 25,
        qMoyen: 16,
        volumeVide: 350,
        tempsVidange: 22,
        formeDebitmetrie: 'normale' as const,
        tempsLatence: 2,
        tempsJusquQmax: 7
      },
      cystometrie: {
        capaciteVesicale: 420,
        pressionDetrusor: 18,
        pressionAbdominale: 10,
        pressionVesicale: 28,
        compliance: 28,
        contractions: 'stables' as const,
        sensibilite: 'normale' as const,
        premierBesoin: 150,
        besoinNormal: 280,
        capaciteMaximale: 420,
        vitesseRemplissage: 50,
        pressionFuite: 0
      },
      profilPression: {
        pressionUretrale: 35,
        longueurUretrale: 28,
        pressionClotureUretrale: 18,
        longueurFonctionnelle: 20,
        pressionTransmission: 65,
        profilDynamique: 'anormal' as const
      },
      emg: {
        activiteBasale: 'diminuee' as const,
        recrutementVolontaire: 'diminue' as const,
        reflexeSphincter: 'present' as const,
        synergieDetrusorSphincter: 'normale' as const,
        fatigabilite: 'augmentee' as const
      },
      etudePressionDebit: {
        pressionDetrusorQmax: 22,
        indexObstruction: -28,
        indexContractilite: 147,
        resistanceUretrale: 0.9,
        conductanceUretrale: 1.14
      },
      testsProvocation: {
        testToux: 'positif_fort' as const,
        testValsalva: 'positif_fort' as const,
        testStressUretral: 0,
        pressionFuiteAbdominale: 35
      },
      cystometrieRemplissage: {
        vitesseLente: {
          compliance: 30,
          contractions: 'absentes' as const,
          sensibilite: 'normale' as const
        },
        vitesseRapide: {
          compliance: 26,
          contractions: 'absentes' as const,
          sensibilite: 'normale' as const
        },
        vitessePhysiologique: {
          compliance: 28,
          contractions: 'absentes' as const,
          sensibilite: 'normale' as const
        }
      },
      residuPostMictionnel: 25
    }
  },
  {
    id: 4,
    titre: "Dyssynergie Vésico-Sphinctérienne",
    description: "Homme de 35 ans avec traumatisme médullaire et dyssynergie",
    donnee: {
      age: 35,
      sexe: 'M' as const,
      symptomes: ['Dysurie', 'Sensation de vidange incomplète', 'Rétention urinaire'],
      antecedents: ['Traumatisme médullaire'],
      traitements: ['Sondage intermittent'],
      debitMetrie: {
        qMax: 6,
        qMoyen: 4,
        volumeVide: 180,
        tempsVidange: 45,
        formeDebitmetrie: 'intermittente' as const,
        tempsLatence: 15,
        tempsJusquQmax: 20
      },
      cystometrie: {
        capaciteVesicale: 350,
        pressionDetrusor: 45,
        pressionAbdominale: 15,
        pressionVesicale: 60,
        compliance: 15,
        contractions: 'instables' as const,
        sensibilite: 'diminuee' as const,
        premierBesoin: 200,
        besoinNormal: 300,
        capaciteMaximale: 350,
        vitesseRemplissage: 50,
        pressionFuite: 0
      },
      profilPression: {
        pressionUretrale: 95,
        longueurUretrale: 20,
        pressionClotureUretrale: 50,
        longueurFonctionnelle: 15,
        pressionTransmission: 95,
        profilDynamique: 'anormal' as const
      },
      emg: {
        activiteBasale: 'augmentee' as const,
        recrutementVolontaire: 'normal' as const,
        reflexeSphincter: 'present' as const,
        synergieDetrusorSphincter: 'dyssynergie' as const,
        fatigabilite: 'normale' as const
      },
      etudePressionDebit: {
        pressionDetrusorQmax: 80,
        indexObstruction: 68,
        indexContractilite: 110,
        resistanceUretrale: 13.3,
        conductanceUretrale: 0.075
      },
      testsProvocation: {
        testToux: 'negatif' as const,
        testValsalva: 'negatif' as const,
        testStressUretral: 0,
        pressionFuiteAbdominale: 0
      },
      cystometrieRemplissage: {
        vitesseLente: {
          compliance: 16,
          contractions: 'presentes' as const,
          sensibilite: 'diminuee' as const
        },
        vitesseRapide: {
          compliance: 14,
          contractions: 'presentes' as const,
          sensibilite: 'diminuee' as const
        },
        vitessePhysiologique: {
          compliance: 15,
          contractions: 'presentes' as const,
          sensibilite: 'diminuee' as const
        }
      },
      residuPostMictionnel: 220
    }
  },
  {
    id: 5,
    titre: "Hypocontractilité Détrusorienne",
    description: "Homme de 68 ans diabétique avec hypocontractilité",
    donnee: {
      age: 68,
      sexe: 'M' as const,
      symptomes: ['Jet faible', 'Sensation de vidange incomplète', 'Poussée abdominale'],
      antecedents: ['Diabète'],
      traitements: [],
      debitMetrie: {
        qMax: 8,
        qMoyen: 5,
        volumeVide: 250,
        tempsVidange: 50,
        formeDebitmetrie: 'en_plateau' as const,
        tempsLatence: 12,
        tempsJusquQmax: 25
      },
      cystometrie: {
        capaciteVesicale: 550,
        pressionDetrusor: 20,
        pressionAbdominale: 12,
        pressionVesicale: 32,
        compliance: 35,
        contractions: 'stables' as const,
        sensibilite: 'diminuee' as const,
        premierBesoin: 250,
        besoinNormal: 400,
        capaciteMaximale: 550,
        vitesseRemplissage: 50,
        pressionFuite: 0
      },
      profilPression: {
        pressionUretrale: 70,
        longueurUretrale: 18,
        pressionClotureUretrale: 38,
        longueurFonctionnelle: 14,
        pressionTransmission: 85,
        profilDynamique: 'normal' as const
      },
      emg: {
        activiteBasale: 'normale' as const,
        recrutementVolontaire: 'normal' as const,
        reflexeSphincter: 'present' as const,
        synergieDetrusorSphincter: 'normale' as const,
        fatigabilite: 'normale' as const
      },
      etudePressionDebit: {
        pressionDetrusorQmax: 15,
        indexObstruction: -1,
        indexContractilite: 55,
        resistanceUretrale: 1.9,
        conductanceUretrale: 0.53
      },
      testsProvocation: {
        testToux: 'negatif' as const,
        testValsalva: 'negatif' as const,
        testStressUretral: 0,
        pressionFuiteAbdominale: 0
      },
      cystometrieRemplissage: {
        vitesseLente: {
          compliance: 38,
          contractions: 'absentes' as const,
          sensibilite: 'diminuee' as const
        },
        vitesseRapide: {
          compliance: 32,
          contractions: 'absentes' as const,
          sensibilite: 'diminuee' as const
        },
        vitessePhysiologique: {
          compliance: 35,
          contractions: 'absentes' as const,
          sensibilite: 'diminuee' as const
        }
      },
      residuPostMictionnel: 150
    }
  },
  {
    id: 6,
    titre: "Incontinence Mixte avec Prolapsus",
    description: "Femme de 72 ans avec incontinence mixte et prolapsus génital",
    donnee: {
      age: 72,
      sexe: 'F' as const,
      symptomes: ['Incontinence mixte', 'Urgenturies', 'Incontinence d\'effort', 'Sensation de vidange incomplète'],
      antecedents: ['Prolapsus génital'],
      traitements: ['Anticholinergiques'],
      debitMetrie: {
        qMax: 12,
        qMoyen: 8,
        volumeVide: 280,
        tempsVidange: 35,
        formeDebitmetrie: 'en_plateau' as const,
        tempsLatence: 8,
        tempsJusquQmax: 15
      },
      cystometrie: {
        capaciteVesicale: 300,
        pressionDetrusor: 35,
        pressionAbdominale: 18,
        pressionVesicale: 53,
        compliance: 16,
        contractions: 'instables' as const,
        sensibilite: 'augmentee' as const,
        premierBesoin: 100,
        besoinNormal: 200,
        capaciteMaximale: 300,
        vitesseRemplissage: 50,
        pressionFuite: 0
      },
      profilPression: {
        pressionUretrale: 45,
        longueurUretrale: 25,
        pressionClotureUretrale: 22,
        longueurFonctionnelle: 18,
        pressionTransmission: 70,
        profilDynamique: 'anormal' as const
      },
      emg: {
        activiteBasale: 'diminuee' as const,
        recrutementVolontaire: 'diminue' as const,
        reflexeSphincter: 'present' as const,
        synergieDetrusorSphincter: 'normale' as const,
        fatigabilite: 'augmentee' as const
      },
      etudePressionDebit: {
        pressionDetrusorQmax: 32,
        indexObstruction: 8,
        indexContractilite: 92,
        resistanceUretrale: 2.7,
        conductanceUretrale: 0.38
      },
      testsProvocation: {
        testToux: 'positif_faible' as const,
        testValsalva: 'positif_faible' as const,
        testStressUretral: 0,
        pressionFuiteAbdominale: 55
      },
      cystometrieRemplissage: {
        vitesseLente: {
          compliance: 18,
          contractions: 'presentes' as const,
          sensibilite: 'augmentee' as const
        },
        vitesseRapide: {
          compliance: 14,
          contractions: 'presentes' as const,
          sensibilite: 'augmentee' as const
        },
        vitessePhysiologique: {
          compliance: 16,
          contractions: 'presentes' as const,
          sensibilite: 'augmentee' as const
        }
      },
      residuPostMictionnel: 65
    }
  }
];

// Fonction d'analyse urodynamique corrigée
export function analyserUrodynamique(data: PatientData): DiagnosticResult {
  let diagnostic = "";
  const recommandations: string[] = [];
  const examensComplementaires: string[] = [];
  const traitements: string[] = [];
  const surveillance: string[] = [];
  const pieges: string[] = [];
  const alertesCritiques: string[] = [];
  const indexCalcules: Record<string, number> = {};
  const nomogrammes: { schafer?: string; abramsGriffiths?: string } = {};
  
  // Calculs des index avec protection contre division par zéro
  indexCalcules["Index d'obstruction (Abrams-Griffiths)"] = data.etudePressionDebit.pressionDetrusorQmax - (2 * data.debitMetrie.qMax);
  indexCalcules["Index de contractilité"] = data.etudePressionDebit.pressionDetrusorQmax + (5 * data.debitMetrie.qMax);
  indexCalcules["Résistance urétrale"] = data.debitMetrie.qMax > 0 ? data.etudePressionDebit.pressionDetrusorQmax / data.debitMetrie.qMax : 0;
  indexCalcules["Conductance urétrale"] = data.etudePressionDebit.pressionDetrusorQmax > 0 ? data.debitMetrie.qMax / data.etudePressionDebit.pressionDetrusorQmax : 0;
  
  // Nomogrammes
  const indexObstruction = indexCalcules["Index d'obstruction (Abrams-Griffiths)"];
  const indexContractilite = indexCalcules["Index de contractilité"];
  
  // Nomogramme d'Abrams-Griffiths
  if (indexObstruction > 40) {
    nomogrammes.abramsGriffiths = "Obstruction";
  } else if (indexObstruction > 20) {
    nomogrammes.abramsGriffiths = "Équivoque";
  } else {
    nomogrammes.abramsGriffiths = "Non obstrué";
  }
  
  // Nomogramme de Schafer
  const qMax = data.debitMetrie.qMax;
  const pDetQmax = data.etudePressionDebit.pressionDetrusorQmax;
  
  if (qMax < 10 && pDetQmax > 50) {
    nomogrammes.schafer = "Obstruction forte";
  } else if (qMax < 15 && pDetQmax > 40) {
    nomogrammes.schafer = "Obstruction modérée";
  } else if (qMax < 20 && pDetQmax > 30) {
    nomogrammes.schafer = "Équivoque";
  } else {
    nomogrammes.schafer = "Normal";
  }
  
  // Alertes critiques (priorité absolue)
  if (data.residuPostMictionnel > 150) {
    alertesCritiques.push("Résidu post-mictionnel élevé - Risque de rétention et d'infection");
  }
  
  if (data.cystometrie.compliance < 10) {
    alertesCritiques.push("Compliance vésicale très réduite - Risque pour le haut appareil urinaire");
  }
  
  if (data.etudePressionDebit.pressionDetrusorQmax > 80) {
    alertesCritiques.push("Pression détrusorienne très élevée - Risque de décompensation vésicale");
  }
  
  // Logique diagnostique hiérarchisée
  
  // 1. Dyssynergie vésico-sphinctérienne (priorité absolue)
  if (data.emg.synergieDetrusorSphincter === 'dyssynergie') {
    diagnostic = "Dyssynergie vésico-sphinctérienne";
    recommandations.push("Sondage intermittent propre");
    recommandations.push("Injection de toxine botulique dans le sphincter externe");
    traitements.push("Auto-sondages intermittents");
    traitements.push("Toxine botulique sphinctérienne");
    traitements.push("Alpha-bloquants");
    examensComplementaires.push("IRM médullaire");
    examensComplementaires.push("Scintigraphie rénale");
    surveillance.push("Fonction rénale tous les 6 mois");
    surveillance.push("Échographie rénale annuelle");
    pieges.push("Ne pas confondre avec pseudo-dyssynergie (anxiété, douleur)");
    pieges.push("Rechercher systématiquement une cause neurologique");
  }
  
  // 2. Obstruction sous-vésicale
  else if ((nomogrammes.schafer === "Obstruction forte" || nomogrammes.schafer === "Obstruction modérée") || 
           (indexObstruction > 35 && qMax < 12)) {
    diagnostic = "Obstruction sous-vésicale";
    
    if (data.sexe === 'M') {
      diagnostic += " (probable hypertrophie prostatique)";
      traitements.push("Alpha-bloquants en première intention");
      traitements.push("Inhibiteurs 5α-réductase si prostate >40g");
      traitements.push("Chirurgie prostatique si échec médical");
      examensComplementaires.push("Échographie prostatique trans-rectale");
      examensComplementaires.push("PSA total et libre");
    } else {
      diagnostic += " (sténose urétrale ou col vésical)";
      examensComplementaires.push("Cystoscopie");
      examensComplementaires.push("Urétrographie rétrograde");
      traitements.push("Dilatation urétrale");
      traitements.push("Urétrotomie interne");
    }
    
    recommandations.push("Traitement de l'obstruction pour prévenir la décompensation vésicale");
    surveillance.push("Contrôle débitmétrie à 3 mois");
    surveillance.push("Surveillance du résidu post-mictionnel");
    pieges.push("Ne pas confondre avec hypocontractilité détrusorienne");
    pieges.push("Vérifier l'absence de dyssynergie associée");
  }
  
  // 3. Hypocontractilité détrusorienne
  else if (indexContractilite < 100 && pDetQmax < 30 && qMax < 12) {
    diagnostic = "Hypocontractilité détrusorienne";
    recommandations.push("Sondage intermittent si résidu >100ml");
    recommandations.push("Manœuvres de Credé et poussées abdominales");
    traitements.push("Auto-sondages intermittents");
    traitements.push("Rééducation vésicale");
    traitements.push("Cholinergiques (béthanéchol) si pas de contre-indication");
    examensComplementaires.push("Bilan neurologique si cause non évidente");
    examensComplementaires.push("Glycémie et HbA1c");
    surveillance.push("Résidu post-mictionnel mensuel");
    surveillance.push("Fonction rénale tous les 6 mois");
    pieges.push("Éliminer une obstruction masquée");
    pieges.push("Rechercher une cause neurologique ou métabolique");
  }
  
  // 4. Hyperactivité détrusorienne
  else if (data.symptomes.includes('Urgenturies') && data.cystometrie.contractions === 'instables') {
    diagnostic = "Hyperactivité détrusorienne";
    
    if (data.antecedents.some(ant => ['Maladie neurologique', 'AVC', 'Sclérose en plaques', 'Maladie de Parkinson', 'Traumatisme médullaire'].includes(ant))) {
      diagnostic += " neurogenique";
      examensComplementaires.push("IRM cérébrale et médullaire");
    } else {
      diagnostic += " idiopathique";
    }
    
    recommandations.push("Traitement anticholinergique en première intention");
    recommandations.push("Rééducation vésico-sphinctérienne");
    traitements.push("Anticholinergiques (solifénacine, fésotérodine)");
    traitements.push("Agonistes β3 (mirabegron) si contre-indication");
    traitements.push("Toxine botulique intradétrusorienne si échec");
    surveillance.push("Évaluation de l'efficacité à 3 mois");
    surveillance.push("Surveillance du résidu post-mictionnel");
    pieges.push("Éliminer une infection urinaire");
    pieges.push("Attention aux effets anticholinergiques chez le sujet âgé");
  }
  
  // 5. Incontinence d'effort
  else if (data.symptomes.includes('Incontinence d\'effort') && 
           (data.testsProvocation.testToux !== 'negatif' || data.testsProvocation.pressionFuiteAbdominale > 0)) {
    diagnostic = "Incontinence urinaire d'effort";
    
    if (data.profilPression.pressionClotureUretrale < 20) {
      diagnostic += " par insuffisance sphinctérienne sévère";
      traitements.push("Chirurgie (bandelette sous-urétrale ou sphincter artificiel)");
      examensComplementaires.push("Bilan pré-opératoire complet");
    } else {
      diagnostic += " par hypermobilité urétrale";
      recommandations.push("Rééducation périnéale en première intention");
      traitements.push("Kinésithérapie périnéale spécialisée");
      traitements.push("Chirurgie si échec de la rééducation");
    }
    
    surveillance.push("Évaluation à 6 mois de rééducation");
    pieges.push("Éliminer une incontinence mixte");
    pieges.push("Vérifier l'absence de prolapsus associé");
  }
  
  // 6. Incontinence mixte
  else if (data.symptomes.includes('Incontinence mixte') || 
           (data.symptomes.includes('Incontinence d\'effort') && data.symptomes.includes('Urgenturies'))) {
    diagnostic = "Incontinence urinaire mixte";
    recommandations.push("Traiter en priorité la composante la plus gênante");
    
    if (data.cystometrie.contractions === 'instables') {
      recommandations.push("Débuter par le traitement de l'hyperactivité détrusorienne");
      traitements.push("Anticholinergiques en première intention");
    }
    
    traitements.push("Rééducation périnéale");
    traitements.push("Chirurgie après stabilisation de l'hyperactivité");
    surveillance.push("Réévaluation à 3 mois de traitement médical");
    pieges.push("Ne pas opérer tant que l'hyperactivité n'est pas contrôlée");
    pieges.push("Évaluer séparément chaque composante");
  }
  
  // 7. Fonction normale (seulement si aucune anomalie détectée)
  else if (qMax >= 15 && indexObstruction < 20 && indexContractilite > 100 && 
           data.cystometrie.contractions === 'stables' && data.residuPostMictionnel < 50) {
    diagnostic = "Fonction vésico-sphinctérienne normale";
    recommandations.push("Aucun traitement spécifique nécessaire");
    surveillance.push("Surveillance clinique simple");
  }
  
  // 8. Diagnostic par défaut si situation complexe
  else {
    diagnostic = "Dysfonction vésico-sphinctérienne complexe - Analyse multidisciplinaire recommandée";
    recommandations.push("Avis spécialisé en neuro-urologie");
    examensComplementaires.push("Bilan urodynamique complémentaire");
    surveillance.push("Réévaluation spécialisée");
  }
  
  // Explications détaillées
  const explications = {
    recommandations: [
      "Les anticholinergiques bloquent les récepteurs muscariniques M3 du détrusor, réduisant les contractions involontaires. Efficacité prouvée dans l'hyperactivité détrusorienne avec amélioration des symptômes dans 60-70% des cas.",
      "La rééducation vésico-sphinctérienne combine techniques comportementales, exercices de renforcement périnéal et biofeedback. Recommandée en première intention par l'EAU et l'AUA pour l'incontinence d'effort et l'hyperactivité vésicale.",
      "Le sondage intermittent propre prévient les complications de la rétention chronique (infections, lithiase, insuffisance rénale). Technique de référence dans la dyssynergie et l'hypocontractilité sévère.",
      "Les alpha-bloquants (tamsulosine, alfuzosine) relaxent le muscle lisse prostatique et cervical, améliorant le débit urinaire de 20-30% selon les études randomisées."
    ],
    examensComplementaires: [
      "L'échographie prostatique trans-rectale évalue précisément le volume prostatique et guide le choix thérapeutique : alpha-bloquants seuls si <40g, association avec inhibiteurs 5α-réductase si >40g selon les recommandations EAU.",
      "Le PSA total et libre permet le dépistage du cancer prostatique, obligatoire chez l'homme >50 ans avec troubles mictionnels. Rapport PSA libre/total <15% évoque une malignité.",
      "L'IRM médullaire recherche une cause neurologique dans la dyssynergie : compression, démyélinisation, syringomyélie. Examen de référence pour le bilan étiologique des troubles neuro-urologiques.",
      "La cystoscopie visualise directement l'urètre et la vessie, indispensable avant chirurgie de l'incontinence pour éliminer une pathologie associée (tumeur, calcul, corps étranger)."
    ],
    traitements: [
      "Les inhibiteurs 5α-réductase (finastéride, dutastéride) réduisent le volume prostatique de 20-25% en 6-12 mois. Indiqués si prostate >40g selon les guidelines internationales, avec effet préventif sur la rétention aiguë.",
      "La toxine botulique intradétrusorienne (100-200 UI) bloque la libération d'acétylcholine, réduisant les contractions détrusoriennes. Efficacité de 70-80% dans l'hyperactivité réfractaire avec durée d'action de 6-9 mois.",
      "La kinésithérapie périnéale spécialisée renforce les muscles du plancher pelvien par exercices ciblés, électrostimulation et biofeedback. Taux de guérison de 50-60% dans l'incontinence d'effort légère à modérée.",
      "La chirurgie par bandelette sous-urétrale (TVT, TOT) est le gold standard de l'incontinence d'effort féminine avec taux de succès de 85-90% à long terme selon les méta-analyses."
    ],
    surveillance: [
      "L'évaluation à 3 mois permet d'ajuster le traitement anticholinergique (dose, molécule) selon l'efficacité et la tolérance. Changement de molécule si amélioration <50% des symptômes.",
      "La surveillance du résidu post-mictionnel détecte précocement une rétention urinaire, complication des anticholinergiques survenant chez 5-10% des patients. Arrêt si RPM >150ml.",
      "Le contrôle débitmétrique objective l'amélioration après traitement de l'obstruction prostatique. Amélioration attendue du Qmax de 30-50% à 3 mois selon les études.",
      "La surveillance de la fonction rénale (créatinine, échographie) est cruciale dans la dyssynergie et l'hypocontractilité pour dépister précocement une atteinte du haut appareil."
    ],
    pieges: [
      "L'hypocontractilité détrusorienne peut mimer une obstruction (débit faible) mais avec pression détrusorienne basse <30 cmH2O. L'étude pression-débit est essentielle pour différencier les deux mécanismes.",
      "La pseudo-dyssynergie (contraction volontaire par anxiété ou douleur) se différencie de la vraie dyssynergie neurologique par la possibilité de relaxation volontaire et l'absence de signes neurologiques.",
      "L'incontinence mixte nécessite de traiter en priorité la composante la plus gênante, généralement l'urgence avant l'effort. La chirurgie de l'effort est contre-indiquée tant que l'hyperactivité n'est pas contrôlée.",
      "Une vessie de lutte (hypertrophie détrusorienne compensatrice) peut masquer une hyperactivité par augmentation de la capacité vésicale et inhibition des contractions involontaires."
    ]
  };
  
  return {
    diagnostic,
    recommandations,
    examensComplementaires,
    traitements,
    surveillance,
    pieges,
    alertesCritiques,
    indexCalcules,
    nomogrammes,
    explications,
    patientData: data
  };
}