declare module "*.json" {
    const value: any;
    export default value;
}

declare var global: any;

interface MortalityData {
    date: Date;
    MortalityEveryone: number;
    MortalityFemales: number;
    MortalityMales: number;
    popshare_25: number;
    popshare25_34: number;	
    popshare35_44: number;	
    popshare44_54: number;
    popshare55_64: number;
    popshare65_74: number;
    popshare75_85: number;
    Rate85up: number;
    Rate75_84: number;
    Rate65_74: number;
    Rate55_64: number;
    Rate45_54: number;
    Rate25_44: number;
    Rate_25: number;
    Normalized85up: number;
    Normalized75_84: number;
    Normalized65_74: number;
    Normalized55_64: number;
    Normalized45_54: number;
    Normalized25_44: number;
    Normalized_25: number;
    Share_25: number;
    Share25_44: number;
    Share45_54: number;
    Share55_64: number;
    Share65_74: number;
    Share75_84: number;
    Share85up: number;
}


interface CausesData {
    date: Date;
    Cancer: number;
    Heart: number;
    LiverKidneyPancreas: number;
    Suicide: number;
    Vehicle: number;
    Drug_induced: number; 
    Homicide: number;
    Respiratory: number;
    AIDS: number;
    Other: number;
    Heart45: number;
    Cancer45: number;
    LiverKidneyPancreas45: number;
    Respiratory45: number;
    Vehicle45: number;
    Suicide45: number;
    Homicide45: number;
    Drug_induced45: number;
    AIDS45: number;
    Other45: number;
    VehicleAll: number;
    Drug_inducedAll: number;
    FirearmAll: number;
    SuicideAll: number;
    AccidentalFirearmAll: number;
    Heart75: number;
    Cancer75: number;
    Respiratory75: number;
    LiverKidneyPancreas75: number;
    Alzheimer75: number;
    Falls75: number;
    Other75: number;
}
