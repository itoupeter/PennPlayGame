#pragma strict
///////////////////////////////////////////
//			Public variables
///////////////////////////////////////////
	
	public var blankTexture : Texture2D;
	public var damageAmount = 5.0f;
	
//////////////////////////////////////////
//			Private variables
//////////////////////////////////////////
	
	private var intensity = 0f;
	private var red = 0.5;
	private var green = 0;
	private var blue = 0;
	private var duration = .3;
	
////////////////////////////////////////
//			Methods
///////////////////////////////////////

	//check if the bullet collides with the player and remove damage
	function OnTriggerEnter ( other : Collider )
	{
		if ( other.transform.tag == "Enemy" || other.transform.tag == "Bullet" ) 
		{
			
		}
		else
		{
			if ( other.transform.tag == "Player" || other.transform.tag == "MainCamera" )
			{
			////////////////////////////////////
			//	call the fps or tps cameras
			// 	damage method here		
			////////////////////////////////////
				var Player = GameObject.Find( "Player" );
				Player.GetComponent( player ).damage( damageAmount );
				intensity = 0.5f;	
				yield WaitForSeconds( duration );
				intensity = 0.0f;
			}
			else if (other.GetComponent.< Collider > ().tag == "Prop")
			{
			    other.gameObject.GetComponent.< Rigidbody > ().AddForce(Random.Range(0, 500),Random.Range(-500, 500),Random.Range(0, 500));
			}
			Destroy( gameObject );
		} 
	}
	
	function OnGUI ( ) 
	{	
		// Creates the red flash on the screen using the blank texture
		var prevColor = GUI.color;
		GUI.color = new Color( red, green, blue, intensity );
		GUI.DrawTexture( Rect( 0.0f, 0.0f, Screen.width, Screen.height ), blankTexture );
	}