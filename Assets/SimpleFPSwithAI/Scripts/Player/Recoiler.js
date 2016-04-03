#pragma strict

/////////////////////////////////////
//         Public Variables
/////////////////////////////////////

public var recoilControlToVertical : float;
public var recoilControlToHorizontal : float;
public var maxVerticalRotation : float;
public var maxHorizontalRotation : float;

/////////////////////////////////////
//         Private Variables
/////////////////////////////////////

private var verticalRotation : float;
private var horizontalRotation : float;

/////////////////////////////////////
//         Methods 
/////////////////////////////////////

function Start () 
{

}

function Update () 
{
 RecoilControl();
 transform.localRotation.x = -verticalRotation/100;
 transform.localRotation.y = horizontalRotation/100;
}


public function ApplyKickToVertical(recoilToVertical : int)
 {
   verticalRotation += recoilToVertical;
 }

public function ApplyKickToHorizontal(recoilToHorizontal : int)
 {
   horizontalRotation += Random.Range(-recoilToHorizontal,recoilToHorizontal);
 }
 
public function ApplyAdditionalKickToSide(additionalRecoilToSide : int)
 {
   horizontalRotation += additionalRecoilToSide/2;
 }
 
 
function RecoilControl()
 {
   if(verticalRotation > 0)
      {
        verticalRotation -= recoilControlToVertical * Time.deltaTime;
      }
    
   if(horizontalRotation > 0)
      {
        horizontalRotation -= recoilControlToHorizontal * Time.deltaTime;
      }
    
   if(horizontalRotation < 0)
      {
        horizontalRotation += recoilControlToHorizontal * Time.deltaTime;
      }


   if(verticalRotation > maxVerticalRotation)
      {
        verticalRotation = maxVerticalRotation + Random.Range(-1,2);
      }
    
   if(horizontalRotation > maxHorizontalRotation)
      {
        horizontalRotation = maxHorizontalRotation + Random.Range(-1,1);;
      }
 }
 
 
 