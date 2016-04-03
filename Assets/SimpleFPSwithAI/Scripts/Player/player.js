#pragma strict


import UnityEngine.SceneManagement;

/////////////////////////////////////
//         Public Variables
/////////////////////////////////////

	public var customSkin : GUISkin;	
	public var crosshair : Texture2D;
	public var health = 100.0f;	
	public var zoom : int = 20;
	public var normal : int = 60;
	public var smooth : float = 5;
	public var respawnEnabled = true;
	public var respawnPoint : GameObject[];
	public var checkPointReached : boolean[];
	public var player : GameObject;
	public var dyingTexture : Texture2D;

/////////////////////////////////////
//         Private Variabels
/////////////////////////////////////

	private var showLabel = false;
	private var timeOfLastHit = 0.0f;
	private var healthRegenerationTime = 10.0f;
	private var intensity = 0f;
	private var red = 1;
	private var green = 0;
	private var blue = 0;

/////////////////////////////////////
//         Methods
/////////////////////////////////////

	function Start ( )
	{
	    for ( var i = 0; i < checkPointReached.length; i++ )
	    {
	        checkPointReached[i] = false;
	    }

	}
	
	function Update ( )
	{
	    // zoom camera on right click
	    if ( Input.GetMouseButton ( 1 ) )
		{
	        Camera.main.fieldOfView = Mathf.Lerp ( Camera.main.fieldOfView,zoom,Time.deltaTime*smooth ); 
	    }
	    else
	    {
	     	Camera.main.fieldOfView = Mathf.Lerp ( Camera.main.fieldOfView,normal,Time.deltaTime*smooth );
	    } 
	    //Counts time till health can regenerate
	    if ( Time.time - timeOfLastHit > healthRegenerationTime )
	    {
	   		healthRegen ( ); 
	   	}
	   	// If health is less than 20 display a warning on the screen
	   	if ( health <= 20 && health > 0 )
		{
			intensity = 1f;	
		}
		else if ( health > 20 )
		{
			if ( intensity > 0 )
			{
				intensity -= Time.deltaTime;
			}
			else
				intensity = 0;	
		}
		else if ( health <= 0.0f ) 
		{
			intensity = 0f;
		}
			  
	}
	
	function damage ( amount : float )
	{
		// Call damage function here for on enemy AI
		health -= amount;
		timeOfLastHit = Time.time;
		if ( health <= 0.0f ) 
		{
			intensity = 0f;
		    Debug.Log ( "Your Dead" );
		    // if respans enabled will respawn at correct spawn point
		    if ( respawnEnabled == true )
		    {
		           
		        for ( var i = 0; i < checkPointReached.length; i++ )
		        {
		            if ( checkPointReached[i] == false )
		            {
		                player.transform.position = Vector3(respawnPoint[i].transform.position.x, respawnPoint[i].transform.position.y, respawnPoint[i].transform.position.z);
		                break;
		            }
		            else
		            {
		                player.transform.position = Vector3(respawnPoint[i + 1].transform.position.x, respawnPoint[i + 1].transform.position.y, respawnPoint[i + 1].transform.position.z);
		                break;
		            }

		        }
		        // reset health ammo and enemies after death
		        health = 100;
		        var weapon = GameObject.Find( "/Player/Recoiler/Camera" );
		        weapon.GetComponent( Weapon ).ammoReset ( );

		        var enemies = GameObject.FindGameObjectsWithTag ( "Enemy" );
		        for (var go : GameObject in enemies)  
		        { 
                    go.GetComponent ( SimpleAI ).resetAI ( );
		        }
            
            
		    }
		    // if respawn not selected restart level
            else
		        SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
		}
	}
	// check to see if health is picked up 
	function OnTriggerEnter( other : Collider )
	{
	    if ( other.transform.tag == "HealthPickup" )
	    {
	        if ( health == 100)
	        {

	        }
	        else
	        {
	            health += 5; 
	            Destroy ( other.gameObject );
	        } 
	    }
	    // check to see if checkpoint reached
   	     if ( other.transform.tag == "CheckPoint" ) 
	     {
	         showLabel = true;
	         yield WaitForSeconds(2.0);
	         showLabel = false;
	         for ( var i = 0; i < checkPointReached.length; i++ )
	         {
	             if ( checkPointReached[i] == false )
	             {
	                 checkPointReached[i] = true;
	                 break;
	             }
	         }
	         if( other.gameObject != null)
	         {
	         	Destroy( other.gameObject );
	         }
	     }
	 }
	 // regen health over time 
	 function healthRegen ( )
	 {
	 	while ( health < 100 )
	 	{
	 		health += 1;
	 		yield WaitForSeconds(1);
	 	}

	 }

	 function OnGUI ( )
	 {
	    GUI.skin = customSkin;
		//show the crosshair
		GUI.DrawTexture( Rect ( Screen.width/2 -7, Screen.height/2 -7, 25, 25 ), crosshair );
		//Show player health
		//var labelPos = 0.0f;
		GUI.Label( Rect ( Screen.width - 100,Screen.height-35,200,80 ), "HP:" + health + "%" );
		//show < 20 health image 
		var prevColor = GUI.color;
		GUI.color = new Color( red, green, blue, intensity );
		GUI.DrawTexture( Rect( 0.0f, 0.0f, Screen.width, Screen.height ), dyingTexture );
	
		// notify user when checkpoint is reached
		if ( showLabel )
		{
		    GUI.Label( new Rect(Screen.width / 2, Screen.height-35, 200, 80), "Check Point Reached..." );
		}
	 }
