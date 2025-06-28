import React, { useState } from 'react';
import { DiagnosticResult } from '../data/urodynamicData';
import { AlertCircle, FileText, TrendingUp, Users, AlertTriangle, Calculator, Target, Info, MousePointer, BarChart3, Activity, Download } from 'lucide-react';
import FlowChart from './Charts/FlowChart';
import PressureFlowChart from './Charts/PressureFlowChart';
import NomogramChart from './Charts/NomogramChart';
import NormalValuesComparison from './Charts/NormalValuesComparison';

interface ResultsPageProps {
  result: DiagnosticResult | null;
  onNewExam: () => void;
}

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    // Calculer la position optimale
    let top = rect.bottom + 8;
    let left = rect.left;
    
    // Si le tooltip dépasse en bas, le placer au-dessus
    if (top + 120 > viewportHeight) {
      top = rect.top - 120 - 8;
    }
    
    // Si le tooltip dépasse à droite, l'ajuster
    if (left + 320 > viewportWidth) {
      left = viewportWidth - 320 - 16;
    }
    
    // Si le tooltip dépasse à gauche, l'ajuster
    if (left < 16) {
      left = 16;
    }
    
    setPosition({ top, left });
    setIsVisible(true);
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div 
          className="fixed z-50 w-80 p-3 text-sm bg-white border border-gray-300 rounded-lg shadow-xl"
          style={{ 
            top: `${position.top}px`, 
            left: `${position.left}px`,
            maxWidth: 'calc(100vw - 32px)'
          }}
        >
          <div className="text-gray-800 leading-relaxed">
            {content}
          </div>
        </div>
      )}
    </div>
  );
}

// Fonction pour générer le PDF
const generatePDF = async (result: DiagnosticResult) => {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  
  // Configuration
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const lineHeight = 7;
  let yPosition = margin;
  
  // Fonction pour ajouter du texte avec retour à la ligne automatique
  const addText = (text: string, x: number, y: number, maxWidth: number, fontSize = 10) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    
    doc.text(lines, x, y);
    return y + (lines.length * lineHeight);
  };
  
  // Fonction pour vérifier si on a besoin d'une nouvelle page
  const checkNewPage = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };
  
  // En-tête
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('RAPPORT D\'ANALYSE URODYNAMIQUE', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date de génération: ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;
  
  // 1. Informations Patient
  checkNewPage(40);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('1. INFORMATIONS PATIENT', margin, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  if (result.patientData) {
    yPosition = addText(`Nom: ${result.patientData.nomPatient || 'Non renseigné'}`, margin, yPosition, pageWidth - 2 * margin);
    yPosition = addText(`Âge: ${result.patientData.age} ans`, margin, yPosition, pageWidth - 2 * margin);
    yPosition = addText(`Sexe: ${result.patientData.sexe === 'M' ? 'Masculin' : 'Féminin'}`, margin, yPosition, pageWidth - 2 * margin);
    yPosition = addText(`RPM: ${result.patientData.residuPostMictionnel} ml`, margin, yPosition, pageWidth - 2 * margin);
  }
  yPosition += 10;
  
  // 2. Profil Clinique
  checkNewPage(60);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('2. PROFIL CLINIQUE', margin, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  if (result.patientData) {
    if (result.patientData.symptomes.length > 0) {
      yPosition = addText(`Symptômes: ${result.patientData.symptomes.join(', ')}`, margin, yPosition, pageWidth - 2 * margin);
    }
    if (result.patientData.antecedents.length > 0) {
      yPosition = addText(`Antécédents: ${result.patientData.antecedents.join(', ')}`, margin, yPosition, pageWidth - 2 * margin);
    }
    if (result.patientData.traitements.length > 0) {
      yPosition = addText(`Traitements: ${result.patientData.traitements.join(', ')}`, margin, yPosition, pageWidth - 2 * margin);
    }
  }
  yPosition += 10;
  
  // 3. Résultats Urodynamiques
  checkNewPage(100);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('3. RÉSULTATS URODYNAMIQUES', margin, yPosition);
  yPosition += 10;
  
  // 3.1 Débitmétrie
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('3.1. Débitmétrie', margin, yPosition);
  yPosition += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  if (result.patientData) {
    yPosition = addText(`Qmax: ${result.patientData.debitMetrie.qMax} ml/s`, margin, yPosition, pageWidth - 2 * margin);
    yPosition = addText(`Q moyen: ${result.patientData.debitMetrie.qMoyen} ml/s`, margin, yPosition, pageWidth - 2 * margin);
    yPosition = addText(`Volume vidé: ${result.patientData.debitMetrie.volumeVide} ml`, margin, yPosition, pageWidth - 2 * margin);
    yPosition = addText(`Temps de vidange: ${result.patientData.debitMetrie.tempsVidange} s`, margin, yPosition, pageWidth - 2 * margin);
    yPosition = addText(`Forme: ${result.patientData.debitMetrie.formeDebitmetrie}`, margin, yPosition, pageWidth - 2 * margin);
  }
  yPosition += 8;
  
  // 3.2 Cystométrie
  checkNewPage(60);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('3.2. Cystométrie', margin, yPosition);
  yPosition += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  if (result.patientData) {
    yPosition = addText(`Capacité vésicale: ${result.patientData.cystometrie.capaciteVesicale} ml`, margin, yPosition, pageWidth - 2 * margin);
    yPosition = addText(`Compliance: ${result.patientData.cystometrie.compliance} ml/cmH2O`, margin, yPosition, pageWidth - 2 * margin);
    yPosition = addText(`Premier besoin: ${result.patientData.cystometrie.premierBesoin} ml`, margin, yPosition, pageWidth - 2 * margin);
    yPosition = addText(`Contractions involontaires: ${result.patientData.cystometrie.contractionsInvolontaires}`, margin, yPosition, pageWidth - 2 * margin);
  }
  yPosition += 8;
  
  // 3.3 Étude Pression-Débit
  checkNewPage(60);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('3.3. Étude Pression-Débit', margin, yPosition);
  yPosition += 8;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  if (result.patientData) {
    yPosition = addText(`Pdet au Qmax: ${result.patientData.etudePressionDebit.pressionDetrusorQmax} cmH2O`, margin, yPosition, pageWidth - 2 * margin);
  }
  
  Object.entries(result.indexCalcules).forEach(([index, valeur]) => {
    yPosition = addText(`${index}: ${valeur.toFixed(1)}`, margin, yPosition, pageWidth - 2 * margin);
  });
  
  if (result.nomogrammes.abramsGriffiths) {
    yPosition = addText(`Nomogramme Abrams-Griffiths: ${result.nomogrammes.abramsGriffiths}`, margin, yPosition, pageWidth - 2 * margin);
  }
  if (result.nomogrammes.schafer) {
    yPosition = addText(`Nomogramme Schafer: ${result.nomogrammes.schafer}`, margin, yPosition, pageWidth - 2 * margin);
  }
  yPosition += 10;
  
  // 4. Diagnostic
  checkNewPage(40);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('4. DIAGNOSTIC', margin, yPosition);
  yPosition += 10;
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  yPosition = addText(result.diagnostic, margin, yPosition, pageWidth - 2 * margin, 12);
  
  if (result.severite) {
    yPosition = addText(`Sévérité: ${result.severite}`, margin, yPosition, pageWidth - 2 * margin);
  }
  yPosition += 10;
  
  // Alertes critiques
  if (result.alertesCritiques.length > 0) {
    checkNewPage(30 + result.alertesCritiques.length * 7);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ALERTES CRITIQUES', margin, yPosition);
    yPosition += 8;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    result.alertesCritiques.forEach(alerte => {
      yPosition = addText(`• ${alerte}`, margin, yPosition, pageWidth - 2 * margin);
    });
    yPosition += 10;
  }
  
  // 5. Recommandations
  checkNewPage(30 + result.recommandations.length * 7);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('5. RECOMMANDATIONS', margin, yPosition);
  yPosition += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  result.recommandations.forEach(recommandation => {
    yPosition = addText(`• ${recommandation.label}`, margin, yPosition, pageWidth - 2 * margin);
  });
  yPosition += 10;
  
  // 6. Traitements
  if (result.traitements.length > 0) {
    checkNewPage(30 + result.traitements.length * 7);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('6. TRAITEMENTS', margin, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    result.traitements.forEach(traitement => {
      yPosition = addText(`• ${traitement.label}`, margin, yPosition, pageWidth - 2 * margin);
    });
    yPosition += 10;
  }
  
  // 7. Examens Complémentaires
  if (result.examensComplementaires.length > 0) {
    checkNewPage(30 + result.examensComplementaires.length * 7);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('7. EXAMENS COMPLÉMENTAIRES', margin, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    result.examensComplementaires.forEach(examen => {
      yPosition = addText(`• ${examen.label}`, margin, yPosition, pageWidth - 2 * margin);
    });
    yPosition += 10;
  }
  
  // 8. Surveillance
  if (result.surveillance.length > 0) {
    checkNewPage(30 + result.surveillance.length * 7);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('8. SURVEILLANCE', margin, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    result.surveillance.forEach(surveillance => {
      yPosition = addText(`• ${surveillance.label}`, margin, yPosition, pageWidth - 2 * margin);
    });
    yPosition += 10;
  }
  
  // 9. Pièges Diagnostiques
  if (result.pieges.length > 0) {
    checkNewPage(30 + result.pieges.length * 7);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('9. PIÈGES DIAGNOSTIQUES', margin, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    result.pieges.forEach(piege => {
      yPosition = addText(`• ${piege.label}`, margin, yPosition, pageWidth - 2 * margin);
    });
  }
  
  // Pied de page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Page ${i} / ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    doc.text('UroDiag - Rapport d\'analyse urodynamique automatisée', margin, pageHeight - 10);
  }
  
  // Télécharger le PDF
  const fileName = `Rapport_Urodynamique_${result.patientData?.nomPatient?.replace(/\s+/g, '_') || 'Patient'}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

export default function ResultsPage({ result, onNewExam }: ResultsPageProps) {
  const [activeChartTab, setActiveChartTab] = useState('flow');

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Aucun Résultat Disponible</h2>
          <p className="text-gray-600 mb-6">Veuillez d'abord effectuer un examen pour voir les résultats.</p>
          <button
            onClick={onNewExam}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Commencer un Examen
          </button>
        </div>
      </div>
    );
  }

  const formatNumber = (value: number | string): string => {
    if (typeof value === 'string') return value;
    
    // Si c'est un nombre entier, l'afficher sans décimale
    if (Number.isInteger(value)) {
      return value.toString();
    }
    
    // Sinon, l'afficher avec une décimale
    return value.toFixed(1);
  };

  const chartTabs = [
    { id: 'flow', label: 'Débitmétrie', icon: BarChart3 },
    { id: 'pressure', label: 'Pression-Débit', icon: Activity },
    { id: 'nomogram', label: 'Nomogrammes', icon: Target },
    { id: 'comparison', label: 'Valeurs Normales', icon: Calculator }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 print:bg-white print:py-4 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 print:px-2">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6 print:shadow-none print:border print:border-gray-300">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 print:bg-blue-600">
            <h1 className="text-2xl font-bold text-white print:text-xl">Rapport d'Analyse Urodynamique Complète</h1>
            <p className="text-blue-100 mt-1 print:text-blue-200">Résultats détaillés avec graphiques et nomogrammes interactifs</p>
          </div>
        </div>

        {/* Info pour les tooltips */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 print:hidden">
          <div className="flex items-center">
            <MousePointer className="w-5 h-5 text-blue-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Information Interactive</h3>
              <p className="text-sm text-blue-700 mt-1">
                Passez votre curseur sur chaque recommandation, examen complémentaire, traitement, surveillance ou piège 
                pour obtenir des explications détaillées et comprendre le raisonnement médical.
              </p>
            </div>
          </div>
        </div>

        {/* Alertes critiques */}
        {result.alertesCritiques.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded print:border print:border-red-400">
            <div className="flex">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Alertes Critiques</h3>
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                  {result.alertesCritiques.map((alerte, index) => (
                    <li key={index}>{alerte}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Diagnostic Principal */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6 print:shadow-none print:border print:border-gray-300">
          <div className="p-6 print:p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 print:text-lg">Diagnostic Principal</h2>
              <div className="flex items-center space-x-2 print:hidden">
                {result.certitudeDiagnostique && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    result.certitudeDiagnostique === 'Élevée' ? 'bg-green-100 text-green-800' :
                    result.certitudeDiagnostique === 'Modérée' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    Certitude: {result.certitudeDiagnostique}
                  </span>
                )}
              </div>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded print:border print:border-blue-400">
              <h3 className="text-lg font-medium text-blue-900 print:text-base">{result.diagnostic}</h3>
              {result.severite && (
                <p className="text-blue-800 mt-2">Sévérité: {result.severite}</p>
              )}
            </div>
          </div>
        </div>

        {/* Graphiques et Analyses */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6 print:shadow-none print:border print:border-gray-300">
          <div className="border-b border-gray-200 print:hidden">
            <nav className="flex space-x-8 px-6">
              {chartTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveChartTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeChartTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6 print:p-4">
            {activeChartTab === 'flow' && result.patientData && (
              <FlowChart data={result.patientData} />
            )}
            {activeChartTab === 'pressure' && result.patientData && (
              <PressureFlowChart data={result.patientData} />
            )}
            {activeChartTab === 'nomogram' && result.patientData && (
              <NomogramChart data={result.patientData} />
            )}
            {activeChartTab === 'comparison' && result.patientData && (
              <NormalValuesComparison data={result.patientData} />
            )}
          </div>
        </div>

        {/* Index Calculés et Nomogrammes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 print:gap-4">
          {/* Index Calculés */}
          {Object.keys(result.indexCalcules).length > 0 && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden print:shadow-none print:border print:border-gray-300">
              <div className="bg-purple-50 px-6 py-4 border-b border-purple-100 print:bg-purple-100 print:p-3">
                <div className="flex items-center">
                  <Calculator className="w-5 h-5 text-purple-600 mr-2" />
                  <h3 className="text-lg font-semibold text-purple-800 print:text-base">Index Calculés</h3>
                </div>
              </div>
              <div className="p-6 print:p-4">
                <div className="space-y-3">
                  {Object.entries(result.indexCalcules).map(([index, valeur]) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium text-gray-700 print:text-sm">{index}:</span>
                      <span className="text-lg font-bold text-purple-600 print:text-base">
                        {formatNumber(valeur)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Nomogrammes */}
          {(result.nomogrammes.schafer || result.nomogrammes.abramsGriffiths) && (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden print:shadow-none print:border print:border-gray-300">
              <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 print:bg-indigo-100 print:p-3">
                <div className="flex items-center">
                  <Target className="w-5 h-5 text-indigo-600 mr-2" />
                  <h3 className="text-lg font-semibold text-indigo-800 print:text-base">Nomogrammes</h3>
                </div>
              </div>
              <div className="p-6 print:p-4">
                <div className="space-y-3">
                  {result.nomogrammes.schafer && (
                    <div>
                      <span className="font-medium text-gray-700 print:text-sm">Schafer:</span>
                      <span className="ml-2 text-indigo-600 print:text-sm">{result.nomogrammes.schafer}</span>
                    </div>
                  )}
                  {result.nomogrammes.abramsGriffiths && (
                    <div>
                      <span className="font-medium text-gray-700 print:text-sm">Abrams-Griffiths:</span>
                      <span className="ml-2 text-indigo-600 print:text-sm">{result.nomogrammes.abramsGriffiths}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Grid des résultats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:gap-4">
          {/* Recommandations */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden print:shadow-none print:border print:border-gray-300">
            <div className="bg-green-50 px-6 py-4 border-b border-green-100 print:bg-green-100 print:p-3">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-green-800 print:text-base">Recommandations</h3>
              </div>
            </div>
            <div className="p-6 print:p-4">
              <ul className="space-y-3">
                {result.recommandations.map((recommandation, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-2 mr-3"></div>
                    <Tooltip content={recommandation.tooltip}>
                      <span className="text-gray-700 cursor-help hover:text-green-700 transition-colors print:text-sm print:cursor-default border-b border-dotted border-green-300 hover:border-green-500">
                        {recommandation.label}
                      </span>
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Examens Complémentaires */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden print:shadow-none print:border print:border-gray-300">
            <div className="bg-purple-50 px-6 py-4 border-b border-purple-100 print:bg-purple-100 print:p-3">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-purple-800 print:text-base">Examens Complémentaires</h3>
              </div>
            </div>
            <div className="p-6 print:p-4">
              <ul className="space-y-3">
                {result.examensComplementaires.map((examen, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3"></div>
                    <Tooltip content={examen.tooltip}>
                      <span className="text-gray-700 cursor-help hover:text-purple-700 transition-colors print:text-sm print:cursor-default border-b border-dotted border-purple-300 hover:border-purple-500">
                        {examen.label}
                      </span>
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Traitements */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden print:shadow-none print:border print:border-gray-300">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 print:bg-blue-100 print:p-3">
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-blue-800 print:text-base">Options Thérapeutiques</h3>
              </div>
            </div>
            <div className="p-6 print:p-4">
              <ul className="space-y-3">
                {result.traitements.map((traitement, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></div>
                    <Tooltip content={traitement.tooltip}>
                      <span className="text-gray-700 cursor-help hover:text-blue-700 transition-colors print:text-sm print:cursor-default border-b border-dotted border-blue-300 hover:border-blue-500">
                        {traitement.label}
                      </span>
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Surveillance */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden print:shadow-none print:border print:border-gray-300">
            <div className="bg-yellow-50 px-6 py-4 border-b border-yellow-100 print:bg-yellow-100 print:p-3">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-yellow-600 mr-2" />
                <h3 className="text-lg font-semibold text-yellow-800 print:text-base">Surveillance</h3>
              </div>
            </div>
            <div className="p-6 print:p-4">
              <ul className="space-y-3">
                {result.surveillance.map((surveillance, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3"></div>
                    <Tooltip content={surveillance.tooltip}>
                      <span className="text-gray-700 cursor-help hover:text-yellow-700 transition-colors print:text-sm print:cursor-default border-b border-dotted border-yellow-300 hover:border-yellow-500">
                        {surveillance.label}
                      </span>
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Pièges Diagnostiques */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-6 print:shadow-none print:border print:border-gray-300 print:mt-4">
          <div className="bg-red-50 px-6 py-4 border-b border-red-100 print:bg-red-100 print:p-3">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold text-red-800 print:text-base">Pièges Diagnostiques à Éviter</h3>
            </div>
          </div>
          <div className="p-6 print:p-4">
            <ul className="space-y-3">
              {result.pieges.map((piege, index) => (
                <li key={index} className="flex items-start">
                  <AlertTriangle className="flex-shrink-0 w-4 h-4 text-red-400 mt-1 mr-3" />
                  <Tooltip content={piege.tooltip}>
                    <span className="text-gray-700 cursor-help hover:text-red-700 transition-colors print:text-sm print:cursor-default border-b border-dotted border-red-300 hover:border-red-500">
                      {piege.label}
                    </span>
                  </Tooltip>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4 mt-8 print:hidden">
          <button
            onClick={onNewExam}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Nouvel Examen
          </button>
          <button
            onClick={() => generatePDF(result)}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger le Rapport
          </button>
        </div>

        {/* Footer pour impression */}
        <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-sm text-gray-600">
          <p>Rapport généré par UroDiag - Plateforme d'aide au diagnostic urodynamique</p>
          <p>Date d'impression: {new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </div>
    </div>
  );
}