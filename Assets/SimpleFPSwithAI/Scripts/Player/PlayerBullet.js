#pragma strict

/////////////////////////////////////
//         Public Variables
/////////////////////////////////////

	public var damageAmount = 10;
	// push power allows player to push objects
	public var pushPower = 5.0;

/////////////////////////////////////
//         Methods
/////////////////////////////////////

	//check if bullet collides with the enemy and remove damage
	// Destroy the object on contact
	function OnTriggerEnter( other : Collider )
	{
		if ( other.transform.tag == "Player" || other.transform.tag == "Bullet" || other.transform.tag == "MainCamera" ) 
		{
			
		}
		else
		{
			if ( other.GetComponent.<Collider>().tag == "Enemy" )
			{
				other.GetComponent.<Collider>().GetComponent( SimpleAI ).damage( damageAmount );
			}
			else if ( other.GetComponent.<Collider>().tag == "Prop")
			{
			    other.gameObject.GetComponent.<Rigidbody>().AddForce(Random.Range(0, 500),Random.Range(-500, 500),Random.Range(0, 500));
			}
			Destroy ( gameObject );
		} 
	}

