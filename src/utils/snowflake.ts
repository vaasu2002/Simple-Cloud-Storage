import FlakeId from 'flake-idgen';

//  custom epoch to reduce digits
const flake = new FlakeId(
    { 
        epoch: 1700000000000 
    }
);

export function generateSnowflakeId(): string {
    const id = flake.next(); 
    return BigInt(
        '0x' + 
        id.toString('hex')
    ).toString(); 
}