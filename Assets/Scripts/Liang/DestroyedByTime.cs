using UnityEngine;
using System.Collections;

public class DestroyedByTime : MonoBehaviour {

    public float life;

    public void Start() {
        StartCoroutine( Destroy() );
    }

    IEnumerator Destroy() {
        yield return new WaitForSeconds(life);
        Destroy( gameObject );
    }
}
