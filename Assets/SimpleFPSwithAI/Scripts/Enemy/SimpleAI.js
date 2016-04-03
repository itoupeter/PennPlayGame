#pragma strict

///////////////////////////////////////////
//			Private variables
///////////////////////////////////////////

private var  agent : NavMeshAgent;
private var targetwaypoint = 0;
private var bullet : GameObject;
private var myTransform : Transform;
private var waypointEnabled = true;
private var isAwake = false;
private var hits = 0;
private var intensity = 0.0f;
private var red = 0.5;
private var green = 0;
private var blue = 0;
private var duration = .3;
private var SoundMinPitch = 0.8f;			
private var SoundMaxPitch = 1.2f;
private var attackTime = 0;
private var isColliding = false;
private var instantVelocity : Vector3;
private var isFleeing = false;
private var allAudioSources : AudioSource[];
private var empty : GameObject;
private var wait = 0;
private var speed = 0;
private var reached = false;
private var isAttacking = false;
private var fleeTimer = 0.0f;
private var soundDetected = false;
private	var Player : GameObject;
private var adrenaline : int;

///////////////////////////////////////////
//			Public variables
///////////////////////////////////////////

public var health = 100;
public var sound : GameObject;
public var blankTexture : Texture2D;
public var steerEnabled = true;
public var steerSpeed = 2.0f;
public var bulletHeight = 0.0f;
public var isProjectile = false;
public var waypointsEnabled = true;
public var waypoints : Transform[];
public var waypointRadius : float  = 1.5;
public var loop : boolean = false;
public var coolDown = 0;
public var target: Transform;
public var moveSpeed = 1.0f;
public var maxDistance = 15;
public var muzzleFlashEnabled = true;
public var muzzleFlash : GameObject;
public var hitSound : AudioClip;
public var awakeSound : AudioClip;
public var deathSound : AudioClip;
public var fireSound : AudioClip;
public var bulletSpeed = 500;
public var bulletObj : GameObject;
public var DeathSpawnObjectEnabled = false;
public var DeathSpawnObject : GameObject[];
public var fleeEnabled = false;
public var fleeWaypoint : GameObject;
public var detectSoundEnabled = false;
public var audioDistance = 20;
public var mask : LayerMask;
public var visionEnabled = false;
public var visibleDistance = 50;
public var visibleAngle = 60;
public var lostDistance = 50;
public var alertDistance = 20;
public var coolDownAdrenaline = 100;
public var cover : GameObject[];

////////////////////////////////////////
//			Methods
///////////////////////////////////////

    function Start ( ) 
    { 

    	agent = gameObject.GetComponent(NavMeshAgent);
        // set for steer 
        instantVelocity = Vector3.zero;
        // set speed for waypoints
        speed = moveSpeed;

        Player = GameObject.Find( "Player" );
    }
	
    function Update ( ) 
    {

        // check if attacktime is 0 
        if ( attackTime > 0 )
        {
            attackTime -= Time.deltaTime;
        }
        if ( attackTime < 0 )
        {
            attackTime = 0;
        }
        // if attack time is 0 and enemy in distance begin attack cycle
        if ( attackTime == 0 && isAwake == true ) 
        {
            // if colliding with object don't attack
            if( !isColliding )
            {	
                // if fleeing from target don't attack
                if ( !isFleeing )
                {
                    Attack( );
                }
                // reset attack time
                attackTime = coolDown;
            }
        }
        // if enemy too far away start search cycle
       if ( Vector3.Distance ( target.position, transform.position ) > 10 )
       {
            // if health is low flee
            if ( health < 30 && fleeEnabled )
            {
                flee ( reached );
                fleeTime ( );
            }
            else
            {
                // if target located run to target 
                if ( isAwake )
                {
                    runToTarget ( );
                }
                else
                {
                    // if colliding don't use vision
                    //if ( !isColliding )
                    //{
						
                        if( visionEnabled == true )
                        {
                            vision ( );
                        }
                        else
                        {
                            noVision ( );
                        }

                        if( detectSoundEnabled && !isAwake )
                        {
                            searchForSounds ( );
                            if( visionEnabled == true )
                        	{
                            	vision ( );
                        	}
                        	else
                        	{
                            	noVision ( );
                        	}

                        }
                        // if sound is detected stop searching and search out the sound
                        if ( GameObject.Find("Sound") == null )
                        {

                            search ( );
                        }
                  //  }
                }
            }
        }
        else
        {
            // if health is low and flee is enabled flee
            if ( health < 30 && fleeEnabled )
            {
                flee ( reached );
                fleeTime ( );
            }
            else
            {
                // if colliding don't move towards target or use steer
                if ( !isColliding )
                {
                    if ( !isAttacking )
                    {
                        runToTarget ( );
                    }
                    if( visionEnabled == true )
                    {
                    	vision ( );
                    }
                    else
                    {
                     	noVision ( );
                    }
                    steer ( );
                }
            }
        }		
    }
///////////////////////////////////////////////////////////////
// call this method to do damage to the enemy
// should be called where the tps fps camera shoots or attacks
///////////////////////////////////////////////////////////////
    function damage ( amount : float )
    {
        // if enemy is searching make him/her attack
        if ( !isAwake )
        {
            isAwake = true;
            if ( soundDetected )
            {
                soundDetected = false;
            }
            Alert ( );
        }
        // decrement health
        health -= amount;
        // increment hits to make a sound every 3 hits
        ++hits;
        if ( hits == 3 ) 
        {
            // play sound when hit
            GetComponent.<AudioSource>().clip = hitSound;
            GetComponent.<AudioSource>().rolloffMode = AudioRolloffMode.Linear;
            GetComponent.<AudioSource>().minDistance = 3;
            GetComponent.<AudioSource>().maxDistance = 250;
            GetComponent.<AudioSource>().dopplerLevel = 2.5;
            GetComponent.<AudioSource>().pitch = Random.Range ( SoundMinPitch, SoundMaxPitch );
            GetComponent.<AudioSource>().playOnAwake = false;
            GetComponent.<AudioSource>().volume = 1;
            GetComponent.<AudioSource>().Play ( );
        }
        if ( health <= 0 )
        {	
            // play death sound
            GetComponent.<AudioSource>().clip =  deathSound;
            GetComponent.<AudioSource>().rolloffMode = AudioRolloffMode.Linear;
            GetComponent.<AudioSource>().minDistance = 3;
            GetComponent.<AudioSource>().maxDistance = 250;
            GetComponent.<AudioSource>().dopplerLevel = 2.5;
            GetComponent.<AudioSource>().pitch = Random.Range ( SoundMinPitch, SoundMaxPitch );
            GetComponent.<AudioSource>().playOnAwake = false;
            GetComponent.<AudioSource>().volume = 1;
            GetComponent.<AudioSource>().Play ( );
            //Destroy Enemy and create the ragdoll
            // spawns death objects like ragdoll or ammmo drops
            if( DeathSpawnObjectEnabled == true )
            { 
                var vec = Vector3 ( this.transform.position.x, this.transform.position.y, this.transform.position.z  );
                Destroy ( gameObject );
                for (  var i = 0; i < DeathSpawnObject.Length; i++  )
                {
                    if ( i == 0 )
                    {
                        var object = Instantiate ( DeathSpawnObject[i], vec, this.transform.rotation );
                    }
                    else
                    {
                        Instantiate ( DeathSpawnObject[i], vec, this.transform.rotation );
                    }
                }
                // This line can be removed espaecially if using ragdolls
               object.GetComponent.<Rigidbody>().AddForce(Random.Range(0, 500),Random.Range(-500, 500),Random.Range(0, 500));
            }
            else
            {
                Destroy ( gameObject );
            }
        }
    }
    // Alert will call other enemies within the alertDistance to your presence
    function Alert ( )
    {
        var enemies : GameObject[];
        if ( isAwake )
        {
            //get all the enemies
            enemies = GameObject.FindGameObjectsWithTag ( "Enemy" );
            for (var go : GameObject in enemies)  
            { 
                // check the distace 
	       		var distance = Vector3.Distance ( transform.position, go.transform.position );
                // alert if distance is within range
	       		if ( distance < alertDistance )
                {
	       			go.GetComponent ( SimpleAI ).isAwake = true;
                    print( "Alerted" );
	       			if ( soundDetected )
                    {
	                	go.GetComponent ( SimpleAI ).soundDetected = false;
                    }
                }
            }
        }
    }

    // This method looks for the closest waypoint
    function waypointSearch ( )
    {	
        var closest = 0;
        var distance = 0;
        var distance2 = 0;
        var close = 0;
        for ( var i = 0; i < waypoints.Length; i++ ) 
        {
            //check the distance of the enemy from all waypoint
            distance = Vector3.Distance ( transform.position, waypoints[i].position );
            if (  i + 1 != waypoints.Length )
            {
                distance2 = Vector3.Distance ( transform.position, waypoints[i + 1].position );
                if ( i == 0 )
                {
                    close = distance;
                }
                if ( distance < distance2 )
                {
                    if ( close <= distance )
                    {
					
                    }
                    else 
                    {
                        close = distance;
                        closest = i;
                    }
                } 
                else 
                {
                    if ( close < distance2 )
                    {
						
                    }
                    else 
                    {
                        close = distance2;
                        closest = i + 1;
                    }
                }
            } 
        }
        // return the closest one
        return closest;	
    }
    // this method searches for the target
    function search ( )
    {
        // if waypoints enabled follow the waypoints 
        if ( waypointsEnabled == true && soundDetected == false )
        {
            // if last waypoint either stop or loop
            if ( Vector3.Distance ( transform.position,waypoints[targetwaypoint].position ) <= waypointRadius )
            {
                targetwaypoint++;
	            
                if ( targetwaypoint >= waypoints.Length )
                {
                    targetwaypoint = 0;
                    if ( !loop )
                        enabled = false;
                }
            }
            // move towards the waypoints
            agent.stoppingDistance = 0;
            agent.SetDestination(waypoints[targetwaypoint].position);
        }	
        else
        {
            if ( soundDetected == false )
            {

            }
        }
    }

    // if target found this method will track the target if they are farther than 10 meters
    function runToTarget ( )
    {
        // if not awake awaken with a sound and alert of enemies 
        if ( isAwake == false )
        {
            GetComponent.<AudioSource>().clip = awakeSound;
            GetComponent.<AudioSource>().rolloffMode = AudioRolloffMode.Linear;
            GetComponent.<AudioSource>().minDistance = 3;
            GetComponent.<AudioSource>().maxDistance = 250;
            GetComponent.<AudioSource>().dopplerLevel = 2.5;
            GetComponent.<AudioSource>().pitch = Random.Range ( SoundMinPitch, SoundMaxPitch );
            GetComponent.<AudioSource>().playOnAwake = false;
            GetComponent.<AudioSource>().volume = 1;
            GetComponent.<AudioSource>().Play ( );
          
            if ( soundDetected )
            {
                soundDetected = false;
            }
            Alert ( );
        }

        if( !isColliding )
        {
        	// working on adrenaline cover system
        	/*if ( coolDownAdrenaline > 0 )
			{
				coolDownAdrenaline -= Time.deltaTime;
			}
			if ( coolDownAdrenaline <= 0 )
			{
				
        		adrenaline = Random.Range ( 0, 25 );
        		coolDownAdrenaline = 100;
        	}*/

        	/*if ( adrenaline <= 25 )
        	{ 
        		agent.stoppingDistance = 0;
        		takeCover(  );
        		print( "taking Cover" );
        	}
        	else if ( adrenaline > 25 ) 
        	{*/
			
             // move towards target 
            	agent.SetDestination( target.position );
            	agent.stoppingDistance = maxDistance;
            	if (  Vector3.Distance( target.position, transform.position ) <= agent.stoppingDistance )
            	{
            			LookAtIgnoreHeight ( target );
            	}
            }
            if ( Vector3.Distance( target.position, transform.position ) > lostDistance )
            {
                isAwake = false;
                if ( waypointsEnabled )
                {
                    waypointSearch ( );
                }
            }
         
    }

    function LookAtIgnoreHeight ( target : Transform ) 
    {
        var lookAtPos : Vector3 = target.position;
        //Set y of LookAt target to be my height.
        lookAtPos.y = transform.position.y;
        transform.LookAt (lookAtPos);
    }
   
    // steer moves the enemy to the movement of the player to make them harder to shoot
    function steer ( )
    {
        if ( steerEnabled )
        {
            var pos : Vector3 = transform.position;
            var horMovement = Input.GetAxis( "Horizontal" );
            var forwardMovement = Input.GetAxis( "Vertical" );
            if ( horMovement ) 
            {
                transform.Translate(transform.right * horMovement * Time.deltaTime * agent.speed);
            } 

            if ( forwardMovement ) 
            {
                transform.Translate(transform.forward * forwardMovement * Time.deltaTime * agent.speed);
            }
            instantVelocity = transform.position - pos;
        }
    }

    // attacks the target
    function Attack ( ) 
    {
        isAttacking = true;
        if ( isProjectile == true )
        {
            fire ( );
        }
        else
        {
            melee ( );
        }
    }

    // method to melee attack
    function melee ( )
    {
    	
        // Check the distance from target
        var distance = Vector3.Distance ( target.transform.position, transform.position );
        var dir = ( target.transform.position - transform.position ).normalized;
        var direction = Vector3.Dot ( dir, transform.forward );
        // if distance and direction are good ATTACK
        if ( distance < 4 ) 
        {
            //if ( direction > 0 ) 
            //{ 
                
                Player.GetComponent( player ).damage( 5 );
                intensity = 0.5;	
                yield WaitForSeconds( duration );
                intensity = 0.0;
            //}
        }
        isAttacking = false;
    }

    // method to fire projectile is isProjectile if selected
    function fire ( )
    {
    	var hit : RaycastHit;
        var rayDirection = ( target.position - transform.position ); 
        // check the angle and if the ray hits the player or target 
        if ( Vector3.Angle ( rayDirection, transform.forward ) < visibleAngle )
        {
            if ( Physics.Raycast ( transform.position, rayDirection, hit, visibleDistance, mask ) ) 
            {
                if ( hit.transform.tag  != "Wall" )
                {
                    if ( hit.transform.tag == "Player" ) 
                    {
                            var pos = Vector3 ( this.transform.position.x, transform.position.y  + bulletHeight,
           					this.transform.position.z  );
					        if ( muzzleFlashEnabled == true )
					        {
					            var muzzle = Instantiate ( muzzleFlash, pos, transform.rotation );
					            yield WaitForSeconds( .2 );
					            Destroy ( muzzle );
					        }
					        bullet = Instantiate ( bulletObj, pos, transform.rotation );
					        bullet.GetComponent.<Rigidbody>().AddForce ( (target.transform.position - transform.position) * bulletSpeed * Time.smoothDeltaTime );	

					        GetComponent.<AudioSource>().clip = fireSound;
					        GetComponent.<AudioSource>().rolloffMode = AudioRolloffMode.Linear;
					        GetComponent.<AudioSource>().minDistance = 3;
					        GetComponent.<AudioSource>().maxDistance = 250;
					        GetComponent.<AudioSource>().dopplerLevel = 2.5;
					        GetComponent.<AudioSource>().pitch = Random.Range ( SoundMinPitch, SoundMaxPitch );
					        GetComponent.<AudioSource>().playOnAwake = false;
					        GetComponent.<AudioSource>().volume = .1;
					        GetComponent.<AudioSource>().Play ( );
					        isAttacking = false;
                
                    }
                }
            }
        }
    }
      // flees from the target if health is low
       function flee (reached2 : boolean )
       {
                    // check if flee point reached
      		if ( Vector3.Distance ( fleeWaypoint.transform.position, transform.position ) < 2 )
            {
            	LookAtIgnoreHeight ( target );
                isFleeing = false;
                reached = true;
                agent.ResetPath ( );
                agent.stoppingDistance = maxDistance;
            }
            else
            {
           		// if reached stand still but look at target
                if ( reached )
                {
                	LookAtIgnoreHeight (target);
                    isFleeing = false;
                    agent.ResetPath ( );
                    agent.stoppingDistance = maxDistance;
                }
                // run to the flee point
                else
                {
                	isFleeing = true;
                    print( "Flee from enemy" );
                    //LookAtIgnoreHeight ( fleeWaypoint.transform );
                    if( !isColliding )
                    {
                    	agent.stoppingDistance = 0;
                    	agent.SetDestination(fleeWaypoint.transform.position);
                               
                    }
                }
            }
      	}
		// after certain amount of time regenerate enemy health
        function fleeTime ( )
        {
        	if ( reached == true )
            {
            	fleeTimer += Time.deltaTime;
                if ( fleeTimer >= 10 )
                {
                	isAwake = false; 
	    			soundDetected = false;
	   				health = 100;
	    			agent.ResetPath ( );
	    			reached = false;
	    			if ( waypointsEnabled )
                	{
                    	waypointSearch ( );
               		}
                }
            }
         }

         // searches for noises and investigates
         function searchForSounds ( )
         {
            // search through all audio sources 
            allAudioSources = FindObjectsOfType(AudioSource) as AudioSource[];
            var vec : Vector3;
            if ( soundDetected == false )
            {
            	for ( var audioS : AudioSource in allAudioSources ) 
                {	// check if a sound is playing and its distance
                	if ( Vector3.Distance ( audioS.transform.position, transform.position ) 
                         < audioDistance && audioS.isPlaying )
                    {
                    	soundDetected = true;
                        print ( "soundDetected" );
                   }
            	}
                // if sound detected look at the target
            	if ( soundDetected == true )
            	{
                	vec = target.position; 
                	transform.LookAt ( vec );
               		empty = Instantiate( Resources.Load( "Sound", GameObject ), vec, transform.rotation );
       			}
         } 
         // walk towards where the target was when sound was deteced 
       	 else
         {
            //LookAtIgnoreHeight ( empty.transform );
            agent.SetDestination(empty.transform.position);
            agent.stoppingDistance = 0;
            //transform.position += transform.forward * ( agent.speed ) * Time.deltaTime;
            if ( Vector3.Distance ( empty.transform.position, transform.position ) < 2 )
            {
            	
                soundDetected = false;
                Destroy ( empty );
                agent.ResetPath ( );
                agent.stoppingDistance = maxDistance;
                if ( waypointsEnabled )
                {
                	
                    waypointSearch ( );

                }
            }
        }   	
    }
    // if within a distance and within an angle with no obstructions will 
    //      the enemy
    function vision ( )
    {	
        var hit : RaycastHit;
        var rayDirection = ( target.position - transform.position ); 
        // check the angle and if the ray hits the player or target 
        if ( Vector3.Angle ( rayDirection, transform.forward ) < visibleAngle )
        {
            if ( Physics.Raycast ( transform.position, rayDirection, hit, visibleDistance, mask ) ) 
            {
                if ( hit.transform.tag  != "Wall" )
                {
                    if ( hit.transform.tag == "Player" ) 
                    {
                        print ( "Detected by vision" );
                        isAwake = true;
                        Alert ( );
                        if ( soundDetected )
                        {
                            soundDetected = false;
                        }
                
                    }
                }
            }
        }
    }
	
    function noVision ( )
    {
        var dist = Vector3.Distance ( transform.position, target.position );
        //print( "Distance to other: " + dist );
        if ( dist <= 10 ) 
        {
            Alert ( );
            runToTarget ( );
        }
    }

    // method to show the lines connecting the waypoints in the editor
    function OnDrawGizmos ( )
    {
        if ( waypointsEnabled )
        {
            Gizmos.color = Color.red;
            for ( var i : int = 0; i < waypoints.Length;i++ )
            {
                var pos : Vector3 = waypoints[i].position;
                if( i > 0 )
            	{
                    var prev : Vector3 = waypoints[i-1].position;
                    Gizmos.DrawLine(prev,pos);
            	}
    		}
		}   
	}
    // resets Ai in case of things like player death
	function resetAI ( )
	{
	    isAwake = false; 
	    soundDetected = false;
	    health = 100;
	    agent.ResetPath ( );
	    if ( waypointsEnabled )
        {
        	waypointSearch ( );
        }
	}
	// dodges right 
	function dodgeRight( )
	{
		transform.Translate ( Vector3.right * agent.speed * Time.deltaTime, Space.Self );
	}
	//dodges left
	function dodgeLeft ( )
	{
    	transform.Translate ( -Vector3.right * agent.speed * Time.deltaTime, Space.Self ); 
	}
	// working on cover system
	function takeCover ( ) 
	{

			//agent.SetDestination ( hit.position );
	}

	// shows the flash red on the screen when the player is hit by melee
	function OnGUI ( ) 
	{	
	    var prevColor = GUI.color;
	    GUI.color = new Color( red, green, blue, intensity );
	    GUI.DrawTexture( Rect( 0.0f, 0.0f, Screen.width, Screen.height ), blankTexture );
	}