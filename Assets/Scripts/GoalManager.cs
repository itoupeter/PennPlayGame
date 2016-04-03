using UnityEngine;
using System.Collections;

public class GoalManager : MonoBehaviour
{
    public float border;

    void Awake()
    {
        InvokeRepeating("timer", 0f, 100f);
    }

    void timer()
    {
        gameObject.SetActive(false);
        float x = Random.Range(-border, border);
        float z = Random.Range(-border, border);
        while ((x + z) > border || (x + z) < -border
            || (x - z) < -border || (x - z) > border)
        {
            x = Random.Range(-border, border);
            z = Random.Range(-border, border);
        }
        transform.position = new Vector3(x, 0f, z);
		gameObject.SetActive(true);
    }
}
