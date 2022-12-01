export interface NewValuationReport {
    authorName: string;
    socialWorker: string;
    generalReferences: string;
    treatment: string;
    currentSituation: string;
    testimony: string;
    socioEcoData: string;
    socialConcept: string;
    classification: string;
    municipalityPermanentId: string;
    populationPermanentId: string;
    municipalityReferenceId: string;
    populationReferenceId: string;
    cityReferenceId: string;
    waterConsumption: number;
    electricityConsumption: number;
    livingPlaceConsumption: number;
    feedingConsumption: number;
    educationConsumption: number;
    telephoneConsumption: number;
    transportationConsumption: number;
    healthConsumption: number;
    otherConsumption: number;
    totalFamilyExpenditure: number;
    descriptionFamilyHome: string;
}
