package auth

// Headers are limitations passed in the request
type Headers struct {
	MaxPeers int    `header:"X-MaxPeers"`
	User     string `header:"X-User"`
}
