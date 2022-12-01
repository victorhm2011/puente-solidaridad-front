export interface Surgery {
    id?: string;
    patientId: string;
    physicianSurgeryId: string;
    physicianFollowId: string;
    surgeryDate: Date;
    pacemakerSerial: string;
    atrialSerial?: string;
    ventricularSerial?: string;
    leftVentricularSerial?: string;
    pacemakerModel: string;
    atrialModel?: string;
    ventricularModel?: string;
    leftVentricularModel?: string; 
    socialWorker: string;
    hospitalId: string;
    hospitalFollowId: string;
    responsibleId: string;
}
