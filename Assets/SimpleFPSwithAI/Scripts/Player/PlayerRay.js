#pragma strict

/////////////////////////////////////
//         Private Variables
/////////////////////////////////////

private var cam: Camera;
private var coolDown = 0.0f;
private var runDodge = 0.0f;
private var looping = false;
private var loopLength = 50f;
private var i = 0.0f;
private var hit : RaycastHit;
private var adrenaline = 0;

function Start ( ) 
{
	cam = GetComponent.<Camera> ( );
}

function Update ( ) 
{
	// set cooldown for enemy dodge
	if( coolDown > 0 )
	{
			coolDown -= Time.deltaTime;
	}
	// if enemy dodges loop to make him move smoothly
	if( looping )
	{
		if ( adrenaline <= 25 )
			waitingRight ( );
		else if ( adrenaline > 25 && adrenaline <= 50 )
			waitingLeft ( );
	}
	// after cooldown cast ray from player crosshair to look at enemies so they know they have a gun pointed at them
	else
	{
		if ( coolDown <= 0 )
		{
			var x = Screen.width / 2;
    		var y = Screen.height / 2;
   			var ray: Ray = cam.ScreenPointToRay(Vector3(x, y, 0));
  			Debug.DrawRay(ray.origin, ray.direction * 1000, Color.yellow);

		
			if ( Physics.Raycast ( ray, hit , 25) )
			{
				if ( hit.collider.gameObject.tag == "Enemy" )
				{
					//use adrenaline to go left or right
					adrenaline = Random.Range ( 0, 50 );
					looping = true;
					coolDown = 1;	 
				}
  			}
  		}
	}
}

// Calls dodge left or right based on adrenaline
function waitingRight()
{
	if ( hit.collider != null )
	{
		hit.collider.GetComponent( SimpleAI ).dodgeRight(  );
		yield WaitForSeconds ( 1 );
		looping = false;
	} 
}

function waitingLeft()
{
	if ( hit.collider != null )
	{
		hit.collider.GetComponent( SimpleAI ).dodgeLeft(  );
		yield WaitForSeconds ( 1 );
		looping = false;
	}  
}
