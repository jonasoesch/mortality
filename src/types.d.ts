declare module "*.json" {
    const value: any;
    export default value;
}

interface MortalityData {
    date: Date;
    MortalityEveryone: number;
    MortalityFemales: number;
    MortalityMales: number;
    popshare_54: number;
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
