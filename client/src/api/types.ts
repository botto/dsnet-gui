export interface NewPeerPayload {
  Owner: string
  Hostname: string
  Description: string
}

export interface AddPeerResponse {
  Conf: string
}
