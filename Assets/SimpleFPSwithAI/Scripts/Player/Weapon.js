#pragma strict

/////////////////////////////////////
//         Public Variables
/////////////////////////////////////

	public var customSkin : GUISkin;
	public var playerBullet : GameObject;
	public var bulletSpeed = 500;
	public var weaponCooldown : float;
	public var ammo : int = 20;
	public var maxAmmo = 30;
	public var fire : AudioClip;
	public var dryFire : AudioClip;
	public var cam : Camera;
	public var recoilSpeed : float = 0.01;
	public var recoiler : GameObject;
	public var verticalKick : int;
	public var sideKick : int;
	public var additionalSideKick : int;  

/////////////////////////////////////
//         Private Variables
/////////////////////////////////////

	private var cooldown = 0.0f;
	private var manager : GameObject;
	private var hit : RaycastHit;
	private var SoundMinPitch = 0.8f;			
	private var SoundMaxPitch = 1.2f;
	private var recoilToVertical : int;
	private var recoilToHorizontal : int;
	private var additionalRecoilToSide : int;

/////////////////////////////////////
//         Methods 
/////////////////////////////////////

	function Start ( )
	{
		recoiler = GameObject.Find("Recoiler");
	}

	function Update ( ) 
	{
		recoilToVertical = verticalKick;
  		recoilToHorizontal = sideKick;
  		additionalRecoilToSide = additionalSideKick;
		//Hide and center cursor
	    Cursor.lockState = CursorLockMode.Locked;
		if( cooldown > 0 )
		{
			cooldown -= Time.deltaTime;
		}
		// on mouse left click fire if cooldown is 0
		if( Input.GetMouseButton( 0 ) && cooldown <= 0   && ammo > 0 )
		{
			var bullet = Instantiate( playerBullet, Camera.main.transform.position, Camera.main.transform.rotation );
			bullet.GetComponent.<Rigidbody>().AddForce ( transform.forward * bulletSpeed );
			ammo--;
			GetComponent.<AudioSource>().clip = fire;
			GetComponent.<AudioSource>().rolloffMode = AudioRolloffMode.Linear;
			GetComponent.<AudioSource>().minDistance = 3;
			GetComponent.<AudioSource>().maxDistance = 250;
			GetComponent.<AudioSource>().dopplerLevel = 2.5;
			GetComponent.<AudioSource>().pitch = Random.Range(SoundMinPitch, SoundMaxPitch);
			GetComponent.<AudioSource>().playOnAwake = false;
			GetComponent.<AudioSource>().volume = .1;
			GetComponent.<AudioSource>().Play();
			// reapply cooldown time
			cooldown = weaponCooldown;
			Debug.Log("Fired");
       		Recoil();
		}
		else if ( ammo == 0 )
		{
		    GetComponent.<AudioSource>().clip = dryFire;
		    GetComponent.<AudioSource>().rolloffMode = AudioRolloffMode.Linear;
		    GetComponent.<AudioSource>().minDistance = 3;
		    GetComponent.<AudioSource>().maxDistance = 250;
		    GetComponent.<AudioSource>().dopplerLevel = 2.5;
		    GetComponent.<AudioSource>().pitch = Random.Range(SoundMinPitch, SoundMaxPitch);
		    GetComponent.<AudioSource>().playOnAwake = false;
		    GetComponent.<AudioSource>().volume = .1;
		    GetComponent.<AudioSource>().Play();
		}
	}

	function ammoPickup ( ammoAmount: int )
	{
	    if ( ammo >= maxAmmo )
	    {
	        ammo = maxAmmo;
	    } 
	    else
	    {
	        ammo += ammoAmount;
	    }
	}

    // add ammo to inventory when picked up
	function OnTriggerEnter( other : Collider )
	{
	     if ( other.transform.tag == "ammo" ) 
	     {
	         if ( ammo == maxAmmo )
	         {

	         }
	         else
	         {
	             ammoPickup( 5 );
	             Destroy( other.gameObject );
	         }
	     }
    }
    // reset ammo
	function ammoReset ( )
	{
	    ammo = maxAmmo;
	}
	//add recoil to gun 
	function Recoil()
 	{
  		recoiler.transform.SendMessage("ApplyKickToVertical",recoilToVertical,SendMessageOptions.DontRequireReceiver);
  		recoiler.transform.SendMessage("ApplyKickToHorizontal",recoilToHorizontal,SendMessageOptions.DontRequireReceiver);
  		recoiler.transform.SendMessage("ApplyAdditionalKickToSide",additionalRecoilToSide,SendMessageOptions.DontRequireReceiver);
 	}

	function OnGUI ( )
	{
	    GUI.skin = customSkin;
	    //show ammo
	    GUI.Label( Rect ( 100 ,Screen.height - 35 , 100 , 50 ), "Ammo:" + ammo); 
	}


