class Peer {
  readonly Hostname   : string;
  readonly Owner      : string;
  readonly Description: string;
  readonly IP?         : string | undefined;
  readonly Added?      : string | undefined;
  readonly Networks?   : string[] | undefined;
  readonly PublicKey?  : string | undefined;
  constructor(
    hostName: string,
    owner: string,
    description: string,
    ip?: string,
    added?: string,
    networks?: string[],
    publicKey?: string,
  ) {
    this.Hostname = hostName;
    this.Owner = owner;
    this.Description = description;
    this.IP = ip;
    this.Added = added;
    this.Networks = networks;
    this.PublicKey = publicKey;
  }
}

export default Peer;
