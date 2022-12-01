export interface Aid {
    id?: string;
    patientId: string;
    reference: string;
    diagnosis: string;
    treatment: string;
    aidDate: Date;
    physicianId: string;
    hospital: string;
    input: number;
    socialConcept: string;
    socioEcoSituation: string;
    monthlyIncome: string;
    socialWorker: string;
    aidType: string;
}