#pragma strict

/////////////////////////////////////
//         Public Variables
/////////////////////////////////////

	public var destroyTime = 20.0f;

/////////////////////////////////////
//         Methods 
/////////////////////////////////////
	
	//Destroy object over given amout of time is seconds
	function Start () 
	{
		Destroy (gameObject, destroyTime);
	}