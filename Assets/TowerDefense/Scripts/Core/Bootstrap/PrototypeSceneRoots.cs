using UnityEngine;

namespace TowerDefense.Core.Bootstrap
{
    public sealed class PrototypeSceneRoots : MonoBehaviour
    {
        [SerializeField] private Transform worldRoot;
        [SerializeField] private Transform terrainRoot;
        [SerializeField] private Transform sitesRoot;
        [SerializeField] private Transform buildingsRoot;
        [SerializeField] private Transform agentsRoot;
        [SerializeField] private Transform cameraRoot;
        [SerializeField] private Transform uiRoot;
        [SerializeField] private Transform debugRoot;

        public Transform WorldRoot => worldRoot;
        public Transform TerrainRoot => terrainRoot;
        public Transform SitesRoot => sitesRoot;
        public Transform BuildingsRoot => buildingsRoot;
        public Transform AgentsRoot => agentsRoot;
        public Transform CameraRoot => cameraRoot;
        public Transform UIRoot => uiRoot;
        public Transform DebugRoot => debugRoot;
    }
}
