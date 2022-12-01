export interface NewPatient {
    patientName: string;
    patientFirstLastName: string;
    patientSecondLastName: string;
    patientDateOfBirth: Date;
    genderId: string;
    patientCellphone: number;
    patientPhone: number;
    familySituation: string;
    socioEcoSituationId: string;
    civilStatus: string;
    medicalDiagnostic: string;
    reference: string;
    surgeryDate: Date;
    hospitalizationDate: Date;
    treatingPhysicianId: string;
    patientOccupation: string;
    valuationReportId: string;
    placeOfBirth: string;
    placeOfResidence: string;
}