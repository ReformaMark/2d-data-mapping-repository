import corn from '@/../public/images/corn.png';
import rice from '@/../public/images/rice.png';
import carrot from '@/../public/images/carrots.png';
import tomatoes from '@/../public/images/tomatoes.png';
import eggplant from '@/../public/images/eggplant.png';


export const barangays = [
    {
      name: "Turu",
      coordinates: [
        [15.23757364214284, 120.7209842288115],
        [15.23504115403541, 120.7223181710091],
        [15.23483360705108, 120.7238241877978], 
        [15.23396242322745, 120.724426995688],
        [15.23392634104796, 120.7295437423003],
        [15.23612585775219, 120.730142657044],
        [15.23794748593046, 120.7302777088259],
        [15.23861161773169, 120.7298052008121],
        [15.24014771615845, 120.7298912892096],
        [15.24143472555273, 120.7304937358044],
        [15.24247264461441, 120.7285573945958],
        [15.24131019584282, 120.7266210442155],
        [15.23964953456423, 120.7255883438239],
        [15.23952497010683, 120.7239101920956],
        [15.23757364214284, 120.7209842288115]
      ] as [number, number][],
      resources: [
        {
          name: "Rice",
          description: "Description of Resource 1",
          coordinates: [15.241111, 120.727222],
          icon: rice.src,
          production: 450
        },
        {
          name: "Rice",
          description: "Description of Resource 2",
          coordinates: [15.239722, 120.726111],
          icon: rice.src,
          production: 450
        },
        {
          name: "Rice",
          description: "Description of Resource 3",
          coordinates: [15.235556, 120.727222],
          icon: rice.src,
          production: 450
        },
        {
          name: "Carrots",
          description: "Description of Resource 1",
          coordinates: [15.241111, 120.727222],
          icon: carrot.src,
          production: 150
        },
        {
          name: "Corn",
          description: "Description of Resource 1",
          coordinates: [15.236944,  120.722222],
          icon: corn.src,
          production: 200
        },
        {
          name: "Tomatoes",
          description: "Description of Resource 1",
          coordinates: [15.235833, 120.724444],
          icon: tomatoes.src,
          production: 300
        },
        {
          name: "Tomatoes",
          description: "Description of Resource 1",
          coordinates: [15.239167, 120.728889],
          icon: tomatoes.src,
          production: 300
        },
        {
          name: "Eggplant",
          description: "Description of Resource 1",
          coordinates: [15.235833, 120.724444],
          icon: eggplant.src,
          production: 180
        },
      ]
    },
    {
      name: "Balitucan", 
      coordinates: [
        [15.2580325133312, 120.702085893901],
        [15.25441176500943, 120.7030277630662],
        [15.25023275301614, 120.70385662648],
        [15.25125474212423, 120.707032001549],
        [15.25200009127965, 120.7071018504154],
        [15.25191279095315, 120.7114086586783],
        [15.25528682789988, 120.7114663479285],
        [15.2558275519475, 120.7138581510603],
        [15.25651963128715, 120.7178323704442],
        [15.2562055939274, 120.719159639315],
        [15.25461935912053, 120.7223368427818],
        [15.25693288228259, 120.7235117946937],
        [15.25717866413609, 120.7225472815681],
        [15.25898296474924, 120.7205834335797],
        [15.25986346443476, 120.7187769584875],
        [15.26088284553879, 120.7162652893677],
        [15.26112535039509, 120.7148643688202],
        [15.26318851844985, 120.7157733539975],
        [15.26427764713529, 120.7131176943544],
        [15.26455182816261, 120.7110181215956],
        [15.26372457223265, 120.7088140967301],
        [15.25973678953887, 120.7060355457266],
        [15.2580325133312, 120.702085893901]
      ] as [number, number][],
      resources: [
        {
          name: "corn",
          description: "Description of Resource 1",
          coordinates: [15.263333 , 120.711389],
          icon: corn.src,
          production: 250
        },
        {
            name: "Corn",
            description: "Corn field",
            coordinates: [15.256111, 120.721667],
            icon: corn.src,
            production: 250
        },
        {
            name: "Corn",
            description: "Corn field",
            coordinates: [15.262222, 120.714722],
            icon: corn.src,
            production: 250
        },
        {
            name: "Carrots",
            description: "Carrots field",
            coordinates: [15.258056, 120.719444],
            icon: carrot.src,
            production: 0
        },
        {
            name: "Carrots",
            description: "Carrots field",
            coordinates: [15.262222, 120.713611],
            icon: carrot.src,
            production: 0
        },
        {
          name: "Rice",
          description: "Rice field",
          coordinates: [15.2625, 120.710278],
          icon: rice.src,
          production: 380
        },
      
        {
          name: "Rice",
          description: "Rice field",
          coordinates: [15.252222, 120.704444],
          icon: rice.src,
          production: 380
        },
        {
          name: "Rice",
          description: "Rice field",
          coordinates: [15.258611, 120.715278],
          icon: rice.src,
          production: 380
        },
        {
          name: "Tomatoes",
          description: "Tomatoes field",
          coordinates: [15.2525, 120.708333],
          icon: tomatoes.src,
          production: 0
        },
        {
          name: "Tomatoes",
          description: "Tomatoes field",
          coordinates: [15.257778, 120.717778],
          icon: tomatoes.src,
          production: 0
        },
        {
          name: "Tomatoes",
          description: "Tomatoes field",
          coordinates: [ 15.261389, 120.708611],
          icon: tomatoes.src,
          production: 0
        },
        
      ]
    },
    {
      name: "Mapinya",
      coordinates: [
        [15.26348317778748, 120.6786236482622],
        [15.2599639211085, 120.6804864374265],
        [15.25793998322601, 120.682854438236],
        [15.25666551320846, 120.6835149456508],
        [15.25550349161334, 120.6837869170254],
        [15.25475379574413, 120.6844474190335],
        [15.25629060198297, 120.6870117858076],
        [15.25640296436537, 120.6893819262208],
        [15.25820211933881, 120.6921407005943],
        [15.25955160579721, 120.6915578929802],
        [15.26067622572919, 120.6892265982165],
        [15.26097612784883, 120.6881386588252],
        [15.26326269924759, 120.6878667723494],
        [15.2631502611023, 120.6854188684163],
        [15.26382271765715, 120.6841744349716],
        [15.2635232926913, 120.6811842224094],
        [15.26389634963894, 120.6806799485361],
        [15.26348317778748, 120.6786236482622]
      ] as [number, number][],
      resources: [],
      production: {
        rice: 0,
        corn: 0,
        carrots: 0,
        tomatoes: 0,
        eggplant: 0
      }
    }
  ]