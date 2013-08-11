
module.exports = {
	username: [/^[a-z][a-z0-9]{3,15}$/i, '* 4~16 bits, letters or nums, led by a letter'],
	password: [/^[\x00-\xff]{6,20}$/, '* 6~20 bits, all kinds of semiangle char, case sensitive'],
	summary: [/^.{0,100}$/, '0~100 bits']
}
